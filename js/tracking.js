import { supabase } from './supabaseClient.js';

const FEED_LIMIT = 15;

/** Escape text before inserting into HTML templates */
function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Get logged-in user from session (reliable right after login) */
async function getSessionUser() {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) console.warn('[Tracking] Session error:', error.message);
  return session?.user ?? null;
}

/** Cached session id + email for matching rows in the feed */
async function getSessionContext() {
  const user = await getSessionUser();
  return {
    userId: user?.id ? String(user.id) : null,
    email: user?.email?.trim().toLowerCase() ?? null
  };
}

/** Same auth user as a DB row? (plain uuid or uuid|email packed form) */
function rowMatchesSession(row, ctx) {
  if (!ctx?.userId || !row?.user_id) return false;
  const rowId = parseUserId(row.user_id).id || String(row.user_id);
  return rowId === ctx.userId;
}

/**
 * Store email inside user_id: "uuid|email@domain.com"
 * Works without a separate user_label column in Supabase.
 */
function packUserId(id, email) {
  if (!id) return null;
  const cleanEmail = email?.trim().toLowerCase();
  return cleanEmail ? `${id}|${cleanEmail}` : String(id);
}

/** Read email back from packed user_id */
function parseUserId(userId) {
  if (!userId) return { id: null, email: null };
  const pipe = String(userId).indexOf('|');
  if (pipe === -1) return { id: String(userId), email: null };
  return {
    id: String(userId).slice(0, pipe),
    email: String(userId).slice(pipe + 1)
  };
}

/** Email shown in feed and visitor list */
function labelFromRow(row, ctx = null) {
  if (row.user_email?.includes('@')) return row.user_email;
  const packed = parseUserId(row.user_id).email;
  if (packed?.includes('@')) return packed;
  if (row.user_label?.includes('@')) return row.user_label;
  // Your old rows only have uuid — show YOUR email when you are logged in
  if (ctx?.email && rowMatchesSession(row, ctx)) return ctx.email;
  return 'Unknown visitor';
}

/** Relative time string */
function formatTimeAgo(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  return date.toLocaleDateString();
}

/**
 * Insert a community action into user_sdg_progress.
 * @returns {Promise<boolean>}
 */
export async function logAction(actionType, goalId = null) {
  try {
    const user = await getSessionUser();

    if (!user?.email) {
      console.warn('[Supabase Tracking] No logged-in email — action not saved.');
      return false;
    }

    // Plain user_id works with your current RLS; user_email column stores email for everyone
    const row = {
      user_id: String(user.id),
      user_email: user.email.trim().toLowerCase(),
      action_type: actionType,
      goal_id: goalId != null ? String(goalId) : null,
      timestamp: new Date().toISOString()
    };

    let { data, error } = await supabase
      .from('user_sdg_progress')
      .insert([row])
      .select('id, user_id, user_email');

    if (error?.message?.includes('user_email')) {
      const { user_email, ...rowWithoutEmail } = row;
      ({ data, error } = await supabase
        .from('user_sdg_progress')
        .insert([rowWithoutEmail])
        .select('id, user_id'));
    }

    if (error) throw error;

    console.log(`[Supabase Tracking] Saved: ${actionType}`, user.email, goalId ?? '', data);
    return true;
  } catch (err) {
    const msg = err?.message || String(err);
    console.error('[Supabase Tracking Error]:', msg, err);

    if (msg.includes('row-level security')) {
      console.error('[Supabase Tracking] Check RLS policies in Supabase.');
    }
    return false;
  }
}

/** Unique visitors for one SDG (most recent visit per user) */
function uniqueVisitors(rows) {
  const byKey = new Map();
  for (const row of rows) {
    const { id, email } = parseUserId(row.user_id);
    const key = id || email || row.timestamp;
    const existing = byKey.get(key);
    if (!existing || new Date(row.timestamp) > new Date(existing.timestamp)) {
      byKey.set(key, row);
    }
  }
  return [...byKey.values()].sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  );
}

/** Fetch everyone who explored a given SDG */
async function fetchGoalVisitors(goalId) {
  let { data, error } = await supabase
    .from('user_sdg_progress')
    .select('user_id, user_email, timestamp')
    .eq('action_type', 'view_goal')
    .eq('goal_id', String(goalId))
    .order('timestamp', { ascending: false })
    .limit(50);

  if (error?.message?.includes('user_email')) {
    const fallback = await supabase
      .from('user_sdg_progress')
      .select('user_id, timestamp')
      .eq('action_type', 'view_goal')
      .eq('goal_id', String(goalId))
      .order('timestamp', { ascending: false })
      .limit(50);
    data = fallback.data;
    error = fallback.error;
  }

  if (error) throw error;
  return uniqueVisitors(data || []);
}

/** Close all open visitor panels except optional keep */
function closeAllVisitorPanels(exceptPanel = null) {
  document.querySelectorAll('.feed-visitors-panel').forEach((panel) => {
    if (panel !== exceptPanel) {
      panel.hidden = true;
      const btn = panel.closest('.feed-item')?.querySelector('.feed-eye-btn');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    }
  });
}

/** Render visitor list HTML inside a panel */
function renderVisitorPanel(panel, goalId, visitors, ctx) {
  if (!visitors.length) {
    panel.innerHTML = `
      <p class="feed-visitors-title">Visitors — SDG ${goalId}</p>
      <p class="feed-visitors-loading">No visits recorded yet for this goal.</p>
    `;
    return;
  }

  const rows = visitors
    .map(
      (v) => `
      <div class="feed-visitor-row">
        <span><i class="fa-solid fa-user"></i>${escapeHtml(labelFromRow(v, ctx))}</span>
        <span class="feed-time">${formatTimeAgo(v.timestamp)}</span>
      </div>
    `
    )
    .join('');

  panel.innerHTML = `
    <p class="feed-visitors-title">Who explored SDG ${goalId} (${visitors.length})</p>
    ${rows}
  `;
}

/** Toggle visitor panel for an SDG eye button */
async function onEyeClick(btn) {
  const feedItem = btn.closest('.feed-item');
  const goalId = feedItem?.dataset.goalId;
  const panel = feedItem?.querySelector('.feed-visitors-panel');
  if (!goalId || !panel) return;

  const isOpen = btn.getAttribute('aria-expanded') === 'true';

  if (isOpen) {
    panel.hidden = true;
    btn.setAttribute('aria-expanded', 'false');
    return;
  }

  closeAllVisitorPanels(panel);
  panel.hidden = false;
  btn.setAttribute('aria-expanded', 'true');
  panel.innerHTML = '<p class="feed-visitors-loading"><i class="fa-solid fa-spinner fa-spin"></i> Loading visitors...</p>';

  try {
    const ctx = await getSessionContext();
    const visitors = await fetchGoalVisitors(goalId);
    renderVisitorPanel(panel, goalId, visitors, ctx);
  } catch (err) {
    console.warn('[Live Feed] Visitors:', err.message);
    panel.innerHTML = `<p class="feed-visitors-loading">Could not load visitors. Try again.</p>`;
  }
}

/** Wire click on eye buttons (event delegation) */
function initFeedEyeDelegation() {
  const activityList = document.getElementById('activity-list');
  if (!activityList) return;

  activityList.addEventListener('click', (e) => {
    const btn = e.target.closest('.feed-eye-btn');
    if (!btn) return;
    e.preventDefault();
    e.stopPropagation();
    onEyeClick(btn);
  });
}

/** Show or update scroll hint below the list */
function updateScrollNote(container, itemCount) {
  let note = container.parentElement?.querySelector('.feed-scroll-note');
  if (!note) {
    note = document.createElement('p');
    note.className = 'feed-scroll-note';
    container.parentElement?.appendChild(note);
  }
  note.textContent =
    itemCount >= FEED_LIMIT
      ? `Showing latest ${FEED_LIMIT} activities — scroll for more`
      : 'Scroll to see more activity';
  note.style.display = itemCount > 3 ? 'block' : 'none';
}

export async function fetchRecentActivity() {
  const activityList = document.getElementById('activity-list');
  if (!activityList) return;

  try {
    const ctx = await getSessionContext();

    let { data, error } = await supabase
      .from('user_sdg_progress')
      .select('action_type, goal_id, timestamp, user_id, user_email')
      .order('timestamp', { ascending: false })
      .limit(FEED_LIMIT);

    if (error?.message?.includes('user_email')) {
      const fallback = await supabase
        .from('user_sdg_progress')
        .select('action_type, goal_id, timestamp, user_id')
        .order('timestamp', { ascending: false })
        .limit(FEED_LIMIT);
      data = fallback.data;
      error = fallback.error;
    }

    if (error) throw error;

    if (!data?.length) {
      activityList.innerHTML = `
        <div class="feed-empty">Be the first to make an impact! Explore a goal above.</div>
      `;
      updateScrollNote(activityList, 0);
      return;
    }

    activityList.innerHTML = '';

    data.forEach((item) => {
      const feedItem = document.createElement('div');
      feedItem.className = 'feed-item glow-hover';

      const timeAgo = formatTimeAgo(item.timestamp);
      const who = escapeHtml(labelFromRow(item, ctx));
      let message = 'Someone took an action';
      let iconClass = 'fa-bolt';
      let iconColor = '#eab308';
      let showEye = false;

      if (item.action_type === 'view_goal') {
        showEye = true;
        iconClass = 'fa-eye';
        iconColor = '#3b82f6';
        message = `<strong>${who}</strong> explored <strong>SDG ${item.goal_id || '?'}</strong>`;
        feedItem.dataset.goalId = item.goal_id;
      } else if (item.action_type === 'take_action') {
        iconClass = 'fa-hand-holding-heart';
        iconColor = '#10b981';
        message = `<strong>${who}</strong> pledged to <strong>${item.goal_id || 'Take Action'}</strong>`;
      } else if (item.action_type === 'start_quiz') {
        iconClass = 'fa-clipboard-question';
        iconColor = '#8b5cf6';
        message = `<strong>${who}</strong> started the <strong>Sustainability Quiz</strong>`;
      }

      const eyeBtn = showEye
        ? `<button type="button" class="feed-eye-btn" aria-expanded="false" aria-label="See who visited SDG ${item.goal_id}">
             <i class="fa-solid fa-eye"></i>
           </button>`
        : `<span class="feed-item-icon"><i class="fa-solid ${iconClass}" style="color:${iconColor}"></i></span>`;

      const visitorsPanel = showEye
        ? `<div class="feed-visitors-panel" hidden></div>`
        : '';

      feedItem.innerHTML = `
        ${eyeBtn}
        <div class="feed-item-body">
          <p>${message}</p>
        </div>
        <span class="feed-time">${timeAgo}</span>
        ${visitorsPanel}
      `;

      activityList.appendChild(feedItem);
    });

    updateScrollNote(activityList, data.length);
  } catch (err) {
    console.warn('[Live Feed Error]', err.message);
    activityList.innerHTML = `
      <div class="feed-error">Feed currently unavailable. Check your Supabase table and policies.</div>
    `;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const sdgGrid = document.getElementById('sdg-grid');
  if (sdgGrid) {
    sdgGrid.addEventListener('click', async (e) => {
      const card = e.target.closest('.sdg-card');
      if (!card) return;
      e.preventDefault();

      const numEl = card.querySelector('.sdg-number');
      const goalNum = numEl ? numEl.textContent.replace('#', '').trim() : 'Unknown';

      const saved = await logAction('view_goal', goalNum);
      if (saved) {
        await fetchRecentActivity();
        window.dispatchEvent(new CustomEvent('sdg-analytics-refresh'));
      }

      window.location.href = card.getAttribute('href');
    });
  }

  document.querySelectorAll('.action-card .btn').forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      const titleEl = e.target.closest('.action-card')?.querySelector('h3');
      const title = titleEl ? titleEl.textContent : 'Unknown Action';
      const saved = await logAction('take_action', title);
      if (saved) await fetchRecentActivity();
    });
  });

  const quizBtn = document.getElementById('start-quiz-btn');
  if (quizBtn) {
    quizBtn.addEventListener('click', async () => {
      const saved = await logAction('start_quiz');
      if (saved) await fetchRecentActivity();
    });
  }

  if (document.getElementById('activity-list')) {
    fetchRecentActivity();
    initFeedEyeDelegation();
  }
});
