import mongoose from "mongoose";
import bcrypt from "bcrypt";

const bc = bcrypt
const saltRounds = 10;


const userIds = [
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
];

export const users = [
  {
    _id: userIds[0],
    firstName: "Henrik",
    lastName: "Ibsen",
    email: "henrik.ibsen@test.com",
    password: bc.hashSync('y^)Wvj&-[#k~', saltRounds),
    picturePath: "p11.jpeg",
    friends: [],
    location: "Oslo, NO",
    occupation: "Marine Biologist",
    viewedProfile: 14561,
    impressions: 888822,
    createdAt: 1115211422,
    updatedAt: Date.now(),
  },
  {
    _id: userIds[1],
    firstName: "Jules",
    lastName: "Lefebvre",
    email: "jlefebvre.art@test.com",
    password: bc.hashSync('H+96V_l;)s-<', saltRounds),
    picturePath: "p3.jpeg",
    friends: [],
    location: "Paris, FR",
    occupation: "Fashion Designer",
    viewedProfile: 12351,
    impressions: 55555,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    _id: userIds[2],
    firstName: "Haruto",
    lastName: "Nakamura",
    email: "h.nakamura88@test.com",
    password: bc.hashSync('[,+M9DTJ,,)e', saltRounds),
    picturePath: "p4.jpeg",
    friends: [],
    location: "Tokyo, JP",
    occupation: "Marketing Specialist",
    viewedProfile: 45468,
    impressions: 19986,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    _id: userIds[3],
    firstName: "Amina",
    lastName: "Chebet",
    email: "amina.chebet@test.com",
    password: bc.hashSync('|[/H@Tw+W/8;', saltRounds),
    picturePath: "p6.jpeg",
    friends: [],
    location: "Nairobi, KE",
    occupation: "Software Developer",
    viewedProfile: 41024,
    impressions: 55316,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    _id: userIds[4],
    firstName: "Anna",
    lastName: "Becker",
    email: "becker.anna@test.com",
    password: bc.hashSync('PYx^t4c@-6!8', saltRounds),
    picturePath: "p5.jpeg",
    friends: [],
    location: "Berlin, DE",
    occupation: "Civil Engineer",
    viewedProfile: 40212,
    impressions: 7758,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    _id: userIds[5],
    firstName: "Lucas",
    lastName: "White",
    email: "lwhite.music@test.com",
    password: bc.hashSync('"S]7f[sla#YC', saltRounds),
    picturePath: "p7.jpeg",
    friends: [],
    location: "Sydney, AU",
    occupation: "Music Producer",
    viewedProfile: 976,
    impressions: 4658,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    _id: userIds[6],
    firstName: "Priya",
    lastName: "Deshmukh",
    email: "dpriya.consultant@test.com",
    password: bc.hashSync('!X4rwp3J%9(,', saltRounds),
    picturePath: "p8.jpeg",
    friends: [],
    location: "Mumbai, IN",
    occupation: "Financial Analyst",
    viewedProfile: 1510,
    impressions: 77579,
    createdAt: Date.now(),
    updatedAt: Date.now(),
      },
  {
    _id: userIds[7],
    firstName: "Emily",
    lastName: "Tremblay",
    email: "emily.tremblay@test.com",
    password: bc.hashSync('Z|4l|M2@@?-S<', saltRounds),
    picturePath: "p9.jpeg",
    friends: [],
    location: "Toronto, CA",
    occupation: "Health Policy Consultant",
    viewedProfile: 19420,
    impressions: 82970,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];

export const posts = [
  {
    _id: new mongoose.Types.ObjectId(),
    userId: userIds[1],
    firstName: "Jules",
    lastName: "Lefebvre",
    location: "Paris, FR",
    description: 
    `Today's muse? The enigmatic dance of sunlight on the Seine, 
    transforming into flowing lines of a new avant-garde summer collection. Stay tuned for the reveal.`,
    picturePath: "post1.jpeg",
    userPicturePath: "p3.jpeg",
    likes: new Map([
      [userIds[0], true],
      [userIds[2], true],
      [userIds[3], true],
      [userIds[4], true],
    ]),
    comments: [
      "That looks just lovely!",
      "This is where dreams weave into reality!",
      "This ensemble is a tribute to Paris's timeless elegance! <3",
    ],
  },
  {
    _id: new mongoose.Types.ObjectId(),
    userId: userIds[3],
    firstName: "Amina",
    lastName: "Chebet",
    location: "Nairobi, KE",
    description:
    `Eager to share my latest project: an app that's set to revolutionize the way we think about sustainable living in Nairobi. 
    This has been a labor of love, from countless lines of code to numerous cups of chai. 
    I've poured my knowledge of software engineering into creating a platform that not only eases our daily lives 
    but also nurtures our community's commitment to the environment. #TechForGood #SustainableLiving #CodeAndChai`,
    picturePath: "post2.jpeg",
    userPicturePath: "p6.jpeg",
    likes: new Map([
      [userIds[7], true],
      [userIds[4], true],
      [userIds[1], true],
      [userIds[2], true],
    ]),
    comments: [
      "This is incredible, Amina! Can't wait to see it live!",
      "Your passion for sustainability shines through your code.",
      "When is the beta release? Keen to try it out!",
      "Always pushing boundaries, keep it up!"
    ],
  },
  {
    _id: new mongoose.Types.ObjectId(),
    userId: userIds[4],
    firstName: "Anna",
    lastName: "Becker",
    location: "Berlin, DE",
    description:
    `Weekend culinary adventure: mastering the art of making traditional Spätzle! 
    Nothing compares to the joy of creating this Swabian comfort food from scratch. 
    The kitchen may be a mess, but my soul is filled with satisfaction. 
    Who knew engineering principles would apply to perfecting noodle elasticity? #FoodieEngineer #BerlinBites #HomemadeHappiness`,
    picturePath: "post3.jpeg",
    userPicturePath: "p5.jpeg",
    likes: new Map([
      [userIds[1], true],
      [userIds[6], true],
      [userIds[3], true],
      [userIds[5], true],
    ]),
    comments: [
      "Wow, Anna, that looks delicious! Send some my way!",
      "Impressive! If engineering doesn't work out, you've got a backup career!",
      "You're making us all hungry with these posts!",
      "The secret's in the dough, right? Share your recipe!",
      "Noodle elasticity – only you could make cooking sound scientific!"
    ],
  },
  {
    _id: new mongoose.Types.ObjectId(),
    userId: userIds[5],
    firstName: "Lucas",
    lastName: "White",
    location: "Sydney, AU",
    description: 
    `Met a new flatmate today - and no, it's not a new roommate, it's a spider the size of a small car. 
    Seriously considering charging it rent! 😂🕷️`,
    picturePath: "post4.jpeg",
    userPicturePath: "p7.jpeg",
    likes: new Map([
      [userIds[1], true],
      [userIds[6], true],
      [userIds[3], true],
    ]),
    comments: [
      "Did it come with its own health insurance? 😅",
      "That's not a spider, Lucas, that's your new guard pet!",
      "Australia, where the spiders are bigger than your future prospects.",
      "Mate, at this point, you might as well name it and add it to the lease.",
      "Remember: no sudden movements and maybe, just maybe, it'll pay rent in flies.",
      "Charge it rent, and if it doesn't pay up, it's time for a showdown at high noon. 🕷️🤠"
  ]
  },
  {
    _id: new mongoose.Types.ObjectId(),
    userId: userIds[6],
    firstName: "Priya",
    lastName: "Deshmukh",
    location: "Mumbai, IN",
    description:
      "Who else gets lost in the world of Baldur's Gate 3? 🎮✨ Been at it for the last 8 hours... 💀😭",
    picturePath: "post5.jpeg",
    userPicturePath: "p8.jpeg",
    likes: new Map([
      [userIds[1], true],
      [userIds[3], true],
      [userIds[5], true],
      [userIds[7], true],
    ]),
    comments: [
      "Who did you choose to romance?",
      "I'M ON MY 4th PLAYTHROUGH DON'T SAY ANYTHING 💀",
      "It's basically my full time job at this point. 🤣",
      "HOW MUCH IS THIS GAME I NEED ITTTT",
      "Is that the one I keep seeing on TikTok???",
    ],
  },
  {
    _id: new mongoose.Types.ObjectId(),
    userId: userIds[7],
    firstName: "Emily",
    lastName: "Tremblay",
    location: "Toronto, CA",
    description:
    "Sketch of my fave video game character - Evelynn!",
    picturePath: "post6.jpeg",
    userPicturePath: "p9.jpeg",
    likes: new Map([
      [userIds[1], true],
      [userIds[2], true],
    ]),

    comments: [
      "Wow, your Evelynn looks like she could step right out of the screen! 😍",
      "I swear, your shading on her lashers is on point.",
      "Seeing this, I'm tempted to main Evelynn now. Killer artwork for a killer champ! 🔪",
      "OMG! 💕💕💕",
      "My fav succubus. 🥰",
      "Please tell me you're doing more LoL character sketches. Can't wait to see which champ is next!"
]
  },
];
