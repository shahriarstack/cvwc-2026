// Gamified Sports Teams and Officers for the 44 Bangladeshi Territories
export interface TeamMember {
  name: string;
  role: "Sales Striker" | "Recovery Goalkeeper" | "Tactical Midfielder";
  avatarCode: "sales" | "recovery" | "tactical";
}

export const TERRITORY_TEAMS: Record<string, TeamMember[]> = {
  "Cox's Bazar": [
    { name: "Tanvir Ahmed", role: "Sales Striker", avatarCode: "sales" },
    { name: "Sajid Hasan", role: "Recovery Goalkeeper", avatarCode: "recovery" }
  ],
  "Narayanganj": [
    { name: "Imtiaz Rahman", role: "Sales Striker", avatarCode: "sales" },
    { name: "Kamrul Islam", role: "Recovery Goalkeeper", avatarCode: "recovery" }
  ],
  "Savar": [
    { name: "Arifur Rahman", role: "Sales Striker", avatarCode: "sales" },
    { name: "Nasir Uddin", role: "Recovery Goalkeeper", avatarCode: "recovery" }
  ],
  "Noakhali": [
    { name: "Rashedul Islam", role: "Sales Striker", avatarCode: "sales" },
    { name: "Jamil Hossain", role: "Recovery Goalkeeper", avatarCode: "recovery" }
  ],
  "Borguna": [
    { name: "Mominul Haque", role: "Sales Striker", avatarCode: "sales" }
  ],
  "Rajshahi": [
    { name: "Shahnawaz Kabir", role: "Sales Striker", avatarCode: "sales" },
    { name: "Abu Naser", role: "Recovery Goalkeeper", avatarCode: "recovery" }
  ],
  "Sylhet": [
    { name: "Mahbubur Rahman", role: "Sales Striker", avatarCode: "sales" },
    { name: "Fahim Shahriar", role: "Recovery Goalkeeper", avatarCode: "recovery" },
    { name: "Rezaul Karim", role: "Tactical Midfielder", avatarCode: "tactical" }
  ],
  "Khulna": [
    { name: "Zillur Rahman", role: "Sales Striker", avatarCode: "sales" },
    { name: "Asif Anjum", role: "Recovery Goalkeeper", avatarCode: "recovery" }
  ],
  "Hobiganj": [
    { name: "Mizanur Rahman", role: "Sales Striker", avatarCode: "sales" },
    { name: "Tariqul Islam", role: "Recovery Goalkeeper", avatarCode: "recovery" }
  ],
  "Chattogram North": [
    { name: "Sajjad Hossain", role: "Sales Striker", avatarCode: "sales" },
    { name: "Imran Khan", role: "Recovery Goalkeeper", avatarCode: "recovery" }
  ],
  "Narshingdi": [
    { name: "Mushfiqur Rahman", role: "Sales Striker", avatarCode: "sales" },
    { name: "Rafiqul Islam", role: "Recovery Goalkeeper", avatarCode: "recovery" }
  ],
  "B. Baria": [
    { name: "Ashraful Islam", role: "Sales Striker", avatarCode: "sales" },
    { name: "Saiful Islam", role: "Recovery Goalkeeper", avatarCode: "recovery" }
  ],
  "Thakurgaon": [
    { name: "Mostafa Kamal", role: "Sales Striker", avatarCode: "sales" }
  ],
  "Feni": [
    { name: "Didarul Alam", role: "Sales Striker", avatarCode: "sales" },
    { name: "Belal Hossain", role: "Recovery Goalkeeper", avatarCode: "recovery" }
  ],
  "Gopalganj": [
    { name: "Monirul Islam", role: "Sales Striker", avatarCode: "sales" },
    { name: "Aminul Islam", role: "Recovery Goalkeeper", avatarCode: "recovery" }
  ],
  "Kishoreganj": [
    { name: "Shahadat Hossain", role: "Sales Striker", avatarCode: "sales" },
    { name: "Zahidul Islam", role: "Recovery Goalkeeper", avatarCode: "recovery" }
  ],
  "Munshiganj": [
    { name: "Kamruzzaman", role: "Sales Striker", avatarCode: "sales" },
    { name: "Asaduzzaman", role: "Recovery Goalkeeper", avatarCode: "recovery" }
  ],
  "Rangpur": [
    { name: "Anisur Rahman", role: "Sales Striker", avatarCode: "sales" },
    { name: "Nurul Islam", role: "Recovery Goalkeeper", avatarCode: "recovery" }
  ],
  "Manikganj": [
    { name: "Mamunur Rashid", role: "Sales Striker", avatarCode: "sales" },
    { name: "Shafiqul Islam", role: "Recovery Goalkeeper", avatarCode: "recovery" }
  ],
  "Cumilla 1": [
    { name: "Jasmin Uddin", role: "Sales Striker", avatarCode: "sales" },
    { name: "Faruk Ahmed", role: "Recovery Goalkeeper", avatarCode: "recovery" }
  ],
  "Tongi": [
    { name: "Sabbir Rahman", role: "Sales Striker", avatarCode: "sales" },
    { name: "Al-Amin", role: "Recovery Goalkeeper", avatarCode: "recovery" }
  ],
  "Chapainawabgonj": [
    { name: "Tariqul Islam", role: "Sales Striker", avatarCode: "sales" }
  ],
  "Nilphamari": [
    { name: "Mizanur Rahman", role: "Sales Striker", avatarCode: "sales" },
    { name: "Azizul Haq", role: "Recovery Goalkeeper", avatarCode: "recovery" }
  ],
  "Sirajganj": [
    { name: "Rashedul Islam", role: "Sales Striker", avatarCode: "sales" },
    { name: "Jahangir Alam", role: "Recovery Goalkeeper", avatarCode: "recovery" }
  ],
  "Tangail": [
    { name: "Anwar Hossain", role: "Sales Striker", avatarCode: "sales" },
    { name: "Saiful Bari", role: "Recovery Goalkeeper", avatarCode: "recovery" }
  ],
  "Jashore": [
    { name: "Masud Rana", role: "Sales Striker", avatarCode: "sales" },
    { name: "Ripon Ahmed", role: "Recovery Goalkeeper", avatarCode: "recovery" }
  ],
  "Gazipur": [
    { name: "Mahfuzur Rahman", role: "Sales Striker", avatarCode: "sales" },
    { name: "Nazmul Huda", role: "Recovery Goalkeeper", avatarCode: "recovery" },
    { name: "Elias Hossain", role: "Tactical Midfielder", avatarCode: "tactical" }
  ],
  "Mymensingh": [
    { name: "Riyad Hasan", role: "Sales Striker", avatarCode: "sales" },
    { name: "Tariqul Islam", role: "Recovery Goalkeeper", avatarCode: "recovery" }
  ],
  "Cumilla-2": [
    { name: "Kamal Hossain", role: "Sales Striker", avatarCode: "sales" },
    { name: "Helal Uddin", role: "Recovery Goalkeeper", avatarCode: "recovery" }
  ],
  "Chattogram South": [
    { name: "Sajid Ahmed", role: "Sales Striker", avatarCode: "sales" },
    { name: "Farhan Tanvir", role: "Recovery Goalkeeper", avatarCode: "recovery" }
  ],
  "Dinajpur": [
    { name: "Aminul Islam", role: "Sales Striker", avatarCode: "sales" }
  ],
  "Dhaka North": [
    { name: "Imran Hossain", role: "Sales Striker", avatarCode: "sales" },
    { name: "Tariq Ahmed", role: "Recovery Goalkeeper", avatarCode: "recovery" }
  ],
  "Dhaka-3": [
    { name: "Rashed Khan", role: "Sales Striker", avatarCode: "sales" },
    { name: "Ziaur Rahman", role: "Recovery Goalkeeper", avatarCode: "recovery" }
  ],
  "Laxmipur": [
    { name: "Hasan Mahmud", role: "Sales Striker", avatarCode: "sales" },
    { name: "Shohel Rana", role: "Recovery Goalkeeper", avatarCode: "recovery" }
  ],
  "Madaripur": [
    { name: "Motiur Rahman", role: "Sales Striker", avatarCode: "sales" },
    { name: "Habibur Rahman", role: "Recovery Goalkeeper", avatarCode: "recovery" }
  ],
  "Bogura": [
    { name: "Sohanur Rahman", role: "Sales Striker", avatarCode: "sales" },
    { name: "Jewel Rana", role: "Recovery Goalkeeper", avatarCode: "recovery" }
  ],
  "Barisal": [
    { name: "Abul Kalam", role: "Sales Striker", avatarCode: "sales" },
    { name: "Babul Akter", role: "Recovery Goalkeeper", avatarCode: "recovery" }
  ],
  "Chandpur": [
    { name: "Sadek Ali", role: "Sales Striker", avatarCode: "sales" },
    { name: "Manik Mia", role: "Recovery Goalkeeper", avatarCode: "recovery" }
  ],
  "Jamalpur": [
    { name: "Siddiqur Rahman", role: "Sales Striker", avatarCode: "sales" }
  ],
  "Natore": [
    { name: "Nazmul Hasan", role: "Sales Striker", avatarCode: "sales" },
    { name: "Mokhlesur Rahman", role: "Recovery Goalkeeper", avatarCode: "recovery" }
  ],
  "Dhaka South": [
    { name: "Sharif Ahmed", role: "Sales Striker", avatarCode: "sales" },
    { name: "Kazi Russel", role: "Recovery Goalkeeper", avatarCode: "recovery" }
  ],
  "Jhenaidah": [
    { name: "Tariqul Islam", role: "Sales Striker", avatarCode: "sales" },
    { name: "Aslam Hossain", role: "Recovery Goalkeeper", avatarCode: "recovery" }
  ],
  "Kushtia": [
    { name: "Sujon Ali", role: "Sales Striker", avatarCode: "sales" },
    { name: "Liton Das", role: "Recovery Goalkeeper", avatarCode: "recovery" }
  ],
  "Netrokona": [
    { name: "Shafiqul Islam", role: "Sales Striker", avatarCode: "sales" },
    { name: "Rezaul Karim", role: "Recovery Goalkeeper", avatarCode: "recovery" }
  ]
};

export function getTerritoryTeam(territory: string): TeamMember[] {
  return TERRITORY_TEAMS[territory] || [
    { name: "Sales Officer", role: "Sales Striker", avatarCode: "sales" },
    { name: "Recovery Officer", role: "Recovery Goalkeeper", avatarCode: "recovery" }
  ];
}

export function getTerritorySalesCaptain(territory: string): string {
  const team = getTerritoryTeam(territory);
  const salesMember = team.find(m => m.role === "Sales Striker");
  return salesMember ? salesMember.name : "Sales Officer";
}

export function getTerritoryRecoveryCaptain(territory: string): string {
  const team = getTerritoryTeam(territory);
  const recMember = team.find(m => m.role === "Recovery Goalkeeper");
  return recMember ? recMember.name : "Recovery Officer";
}
