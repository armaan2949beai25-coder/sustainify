import { 
  HeartHandshake, 
  Wheat, 
  HeartPulse, 
  BookOpen, 
  Users, 
  Droplet, 
  Zap, 
  TrendingUp, 
  Building2, 
  Scale, 
  MapPin, 
  Recycle, 
  CloudRain, 
  Fish, 
  TreePine, 
  Scale3D, 
  Handshake 
} from 'lucide-react';

export const goalsData = [
  {
    id: 1,
    title: "No Poverty",
    shortDescription: "End poverty in all its forms everywhere.",
    detailedDescription: "Globally, the number of people living in extreme poverty declined from 36 per cent in 1990 to 10 per cent in 2015. But the pace of change is decelerating and the COVID-19 crisis risks reversing decades of progress in the fight against poverty. Ending poverty requires universal social protection systems aimed at safeguarding all individuals throughout the life cycle.",
    features: [
        "Eradicate extreme poverty globally.",
        "Implement social protection systems and measures for all.",
        "Ensure equal rights to economic resources.",
        "Build resilience of the poor and those in vulnerable situations."
    ],
    icon: HeartHandshake,
    colorHex: "#e5243b"
  },
  {
    id: 2,
    title: "Zero Hunger",
    shortDescription: "End hunger, achieve food security and improved nutrition.",
    detailedDescription: "After decades of steady decline, the number of people who suffer from hunger has slowly increased over the past three years. A profound change of the global food and agriculture system is needed if we are to nourish the more than 690 million people who are hungry today.",
    features: [
        "End hunger and ensure access by all people to nutritious food.",
        "End all forms of malnutrition.",
        "Double the agricultural productivity and incomes of small-scale food producers.",
        "Ensure sustainable food production systems."
    ],
    icon: Wheat,
    colorHex: "#dda63a"
  },
  {
    id: 3,
    title: "Good Health & Well-being",
    shortDescription: "Ensure healthy lives and promote well-being for all at all ages.",
    detailedDescription: "Ensuring healthy lives and promoting well-being at all ages is essential to sustainable development. Significant strides have been made in increasing life expectancy and reducing some of the common killers associated with child and maternal mortality.",
    features: [
        "Reduce the global maternal mortality ratio.",
        "End preventable deaths of newborns and children under 5.",
        "End the epidemics of AIDS, tuberculosis, malaria and neglected tropical diseases.",
        "Promote mental health and well-being."
    ],
    icon: HeartPulse,
    colorHex: "#4c9f38"
  },
  {
    id: 4,
    title: "Quality Education",
    shortDescription: "Ensure inclusive and equitable quality education.",
    detailedDescription: "Education enables upward socioeconomic mobility and is a key to escaping poverty. Over the past decade, major progress was made towards increasing access to education and school enrollment rates at all levels.",
    features: [
        "Ensure that all girls and boys complete free, equitable and quality primary and secondary education.",
        "Ensure equal access for all women and men to affordable and quality technical, vocational and tertiary education.",
        "Substantially increase the number of youth and adults who have relevant skills.",
        "Eliminate gender disparities in education."
    ],
    icon: BookOpen,
    colorHex: "#c5192d"
  },
  {
    id: 5,
    title: "Gender Equality",
    shortDescription: "Achieve gender equality and empower all women and girls.",
    detailedDescription: "Gender equality is not only a fundamental human right, but a necessary foundation for a peaceful, prosperous and sustainable world. There has been progress over the last decades: more girls are going to school, fewer girls are forced into early marriage, more women are serving in parliament and positions of leadership.",
    features: [
        "End all forms of discrimination against all women and girls everywhere.",
        "Eliminate all forms of violence against all women and girls.",
        "Eliminate all harmful practices, such as child, early and forced marriage.",
        "Recognize and value unpaid care and domestic work."
    ],
    icon: Users, // Using Users as a close proxy, could also use others
    colorHex: "#ff3a21"
  },
  {
    id: 6,
    title: "Clean Water & Sanitation",
    shortDescription: "Ensure availability and sustainable management of water.",
    detailedDescription: "While substantial progress has been made in increasing access to clean drinking water and sanitation, billions of people—mostly in rural areas—still lack these basic services. Worldwide, one in three people do not have access to safe drinking water.",
    features: [
        "Achieve universal and equitable access to safe and affordable drinking water.",
        "Achieve access to adequate and equitable sanitation and hygiene for all.",
        "Improve water quality by reducing pollution.",
        "Substantially increase water-use efficiency across all sectors."
    ],
    icon: Droplet,
    colorHex: "#26bde2"
  },
  {
    id: 7,
    title: "Affordable & Clean Energy",
    shortDescription: "Ensure access to affordable, reliable, sustainable energy.",
    detailedDescription: "The world is making progress towards Goal 7, with encouraging signs that energy is becoming more sustainable and widely available. Access to electricity in poorer countries has begun to accelerate, energy efficiency continues to improve, and renewable energy is making impressive gains.",
    features: [
        "Ensure universal access to affordable, reliable and modern energy services.",
        "Increase substantially the share of renewable energy in the global energy mix.",
        "Double the global rate of improvement in energy efficiency.",
        "Enhance international cooperation to facilitate access to clean energy research."
    ],
    icon: Zap,
    colorHex: "#fcc30b"
  },
  {
    id: 8,
    title: "Decent Work & Economic Growth",
    shortDescription: "Promote sustained, inclusive economic growth.",
    detailedDescription: "Sustained and inclusive economic growth can drive progress, create decent jobs for all and improve living standards. COVID-19 has disrupted billions of lives and endangered the global economy.",
    features: [
        "Sustain per capita economic growth in accordance with national circumstances.",
        "Achieve higher levels of economic productivity through diversification.",
        "Promote development-oriented policies that support productive activities.",
        "Improve progressively global resource efficiency in consumption and production."
    ],
    icon: TrendingUp,
    colorHex: "#a21942"
  },
  {
    id: 9,
    title: "Industry, Innovation & Infrastructure",
    shortDescription: "Build resilient infrastructure, promote inclusive industrialization.",
    detailedDescription: "Inclusive and sustainable industrialization, together with innovation and infrastructure, can unleash dynamic and competitive economic forces that generate employment and income. They play a key role in introducing and promoting new technologies.",
    features: [
        "Develop quality, reliable, sustainable and resilient infrastructure.",
        "Promote inclusive and sustainable industrialization.",
        "Increase the access of small-scale industrial and other enterprises to financial services.",
        "Upgrade infrastructure and retrofit industries to make them sustainable."
    ],
    icon: Building2,
    colorHex: "#fd6925"
  },
  {
    id: 10,
    title: "Reduced Inequalities",
    shortDescription: "Reduce inequality within and among countries.",
    detailedDescription: "Reducing inequalities and ensuring no one is left behind are integral to achieving the Sustainable Development Goals. Inequality within and among countries is a persistent cause for concern.",
    features: [
        "Progressively achieve and sustain income growth of the bottom 40 per cent.",
        "Empower and promote the social, economic and political inclusion of all.",
        "Ensure equal opportunity and reduce inequalities of outcome.",
        "Adopt policies, especially fiscal, wage and social protection policies."
    ],
    icon: Scale,
    colorHex: "#dd1367"
  },
  {
    id: 11,
    title: "Sustainable Cities",
    shortDescription: "Make cities inclusive, safe, resilient and sustainable.",
    detailedDescription: "The world is becoming increasingly urbanized. Since 2007, more than half the world’s population has been living in cities, and that share is projected to rise to 60 per cent by 2030.",
    features: [
        "Ensure access for all to adequate, safe and affordable housing.",
        "Provide access to safe, affordable, accessible and sustainable transport systems.",
        "Enhance inclusive and sustainable urbanization.",
        "Protect and safeguard the world's cultural and natural heritage."
    ],
    icon: MapPin,
    colorHex: "#fd9d24"
  },
  {
    id: 12,
    title: "Responsible Consumption",
    shortDescription: "Ensure sustainable consumption and production patterns.",
    detailedDescription: "Worldwide consumption and production — a driving force of the global economy — rest on the use of the natural environment and resources in a way that continues to have destructive impacts on the planet.",
    features: [
        "Implement the 10-year framework of programs on sustainable consumption.",
        "Achieve the sustainable management and efficient use of natural resources.",
        "Halve per capita global food waste at the retail and consumer levels.",
        "Environmentally sound management of chemicals and all wastes."
    ],
    icon: Recycle,
    colorHex: "#bf8b2e"
  },
  {
    id: 13,
    title: "Climate Action",
    shortDescription: "Take urgent action to combat climate change and its impacts.",
    detailedDescription: "Climate change is affecting every country on every continent. It is disrupting national economies and affecting lives, costing people, communities and countries dearly today and even more tomorrow.",
    features: [
        "Strengthen resilience and adaptive capacity to climate-related hazards.",
        "Integrate climate change measures into national policies.",
        "Improve education, awareness-raising and human and institutional capacity on climate change.",
        "Implement the commitment undertaken by developed-country parties to the UNFCCC."
    ],
    icon: CloudRain,
    colorHex: "#3f7e44"
  },
  {
    id: 14,
    title: "Life Below Water",
    shortDescription: "Conserve and sustainably use the oceans, seas and marine resources.",
    detailedDescription: "The ocean drives global systems that make the Earth habitable for humankind. Our rainwater, drinking water, weather, climate, coastlines, much of our food, and even the oxygen in the air we breathe, are all ultimately provided and regulated by the sea.",
    features: [
        "Prevent and significantly reduce marine pollution of all kinds.",
        "Sustainably manage and protect marine and coastal ecosystems.",
        "Minimize and address the impacts of ocean acidification.",
        "Effectively regulate harvesting and end overfishing."
    ],
    icon: Fish,
    colorHex: "#0a97d9"
  },
  {
    id: 15,
    title: "Life on Land",
    shortDescription: "Sustainably manage forests, combat desertification, halt land degradation.",
    detailedDescription: "Nature is critical to our survival: nature provides us with our oxygen, regulates our weather patterns, pollinates our crops, produces our food, feed and fibre. But it is under increasing stress.",
    features: [
        "Ensure the conservation, restoration and sustainable use of terrestrial ecosystems.",
        "Promote the implementation of sustainable management of all types of forests.",
        "Combat desertification, restore degraded land and soil.",
        "Ensure the conservation of mountain ecosystems."
    ],
    icon: TreePine,
    colorHex: "#56c02b"
  },
  {
    id: 16,
    title: "Peace & Justice",
    shortDescription: "Promote just, peaceful and inclusive societies.",
    detailedDescription: "Conflict, insecurity, weak institutions and limited access to justice remain a great threat to sustainable development. The number of people fleeing war, persecution and conflict exceeded 70 million in 2018.",
    features: [
        "Significantly reduce all forms of violence and related death rates everywhere.",
        "End abuse, exploitation, trafficking and all forms of violence against children.",
        "Promote the rule of law at the national and international levels.",
        "Substantially reduce corruption and bribery in all their forms."
    ],
    icon: Scale3D,
    colorHex: "#00689d"
  },
  {
    id: 17,
    title: "Partnerships for Goals",
    shortDescription: "Revitalize the global partnership for sustainable development.",
    detailedDescription: "The SDGs can only be realized with strong global partnerships and cooperation. A successful development agenda requires inclusive partnerships built upon principles and values, a shared vision, and shared goals.",
    features: [
        "Strengthen domestic resource mobilization to improve domestic capacity.",
        "Developed countries to implement fully their official development assistance commitments.",
        "Mobilize additional financial resources for developing countries.",
        "Enhance North-South, South-South and triangular regional and international cooperation."
    ],
    icon: Handshake,
    colorHex: "#19486a"
  }
];
