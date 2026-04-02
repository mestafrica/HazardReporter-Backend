export type Trending_Post = {
    id: string;
    name: string;
    time: string;
    description: string;
    profileImage: string;
    postImage1: string;
    postImage2: string;
    likes: string;
    comment: string;
    shares: string;
    
};

export type Recent_Post = {
  id: string;
  name: string;
  time: string;
  description: string;
  profileImage: string;
  postImage1: string;
  postImage2: string;
  postImage3: string;
  likes: string;
  comment: string;
  shares: string;
  
};

export type Announcement = {
  id: string
  title: string
  date: string
  description: string;
  profileImage: string; 
  
};

export const trending_posts: Trending_Post[] = [
    {
        id: "0",
        name: "Kwame Kay",
        time: "22 hours ago",
        description: "Lorem ipsum dolor sit amet consectetur. Turpis id bibendum proin vivamus.",
        profileImage:"https://s3-alpha-sig.figma.com/img/a0bf/14eb/80e3278d642122f2264538a97367ef3e?Expires=1733097600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=U4DqUztW2Q3P6l7s4PGJOGnr7QNcgFDTB2P5i4zeOSjqC2SV-450uvHA-SayAnINKgJmAZdBxJG9MmCAMheIGsPgw6IFV1bcRFlWRBR6tKUBCAD2F3mz9p4tzMeRFgt47n8tIBxwWSW2pD0kwkMmaNr7lN6-M~5kOt0ngEbmXJaq1JpRW6Wo9fmtduS0i6MXQQnisxXWGtDOXAOGaVfNx2qDUow3qVnJkPuqD9mEak96pSwrLQwVQfkGOm4RGfrYtJd-v-xkZ9XRnAgxlJMLv58k21R4L4BdKp-Tnk0IMc14jvy0DVf-5A~xHSUWxHE-i5eCfIyi1PZILInCmst7PQ__",
        postImage1:"https://s3-alpha-sig.figma.com/img/5991/bce0/149a888a465938311c5bf672cab174ba?Expires=1733097600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=QLcn4SmXnKFw2XmFnp9zSQcajJFa9pkbiWlXdFY5v6vZiKrLHmkIX45Ulxw3haCS1ALTWWKjtCYr0aYH7hcYSBxlbfTKkTglv13dK7BHvx1kJZm4EUmPyKcRct9iyCfNoOcfkOyq8NTrAAIoVwQ4-PQNx8VS6CWCVtiHX025Uck6wYYohioT2JqQDRYPRpWQpaKL78TYExgwwuaJUKBRYfdQKYzrz5WcXQIAPw6N3kCNpC8Y08p75RRkVUjbE3Ob92EYIO-LK39w5mOVtFtl3NiWCXHXPmumsg5WJEAeShXGgGEFl93zax8-S68ShhF8B1iWSdc8rz1OtnZisWvumQ__",
        postImage2: "",
        comment:"120",
        likes: "5k",
        shares: "120",
      },
    {
        id: "1",
        name: "Desirae Septimus",
        time: "10 hours ago",
        description: "Lorem ipsum dolor sit amet consectetur. Turpis id bibendum proin vivamus.",
        profileImage:"https://s3-alpha-sig.figma.com/img/137b/8ab9/f9527e6c4d2ceccd6e1ef88294d20664?Expires=1733097600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=UWQt~ToUdyFhmqmeNMzv6jkRPjDtAL2P00OAp7L~l67aDVKASMd36yOjlzl4PtU4a6uhdYPNBMYAHNsKKVapRHx5DPPfMr4GLCS6WpLnsUT5evxwfJkiWdKLwsAvGjgPUhVSwxceAcUZ7aIiVlE5iKT-uX~YldpeD6lWNxnDcK8joeBbCWbwnJ28Ka2~yPpC4Qz~kBVO4V1xpVlg~yofByOfgSLO5wWgvOQiyYK7OpE-yHmro0WVuPGmrmMUn6j5S33oW6WnnvlqkmVjRPkV6HrbWpBN0WmOL7V2cAjC7sW3VuwbN6VEPcBHSAQ7BAqGVx9hy3rYrsfrH~9ntlic5w__",
        postImage1:"https://s3-alpha-sig.figma.com/img/a788/0ed9/5ec70a9603e7ff04a64c276a5bf6987c?Expires=1733097600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=aWZuRxXK35qv-4NJtpZCR90p6mpZfY7XRchb4rw7JuqpRGBrdGxsMGMyZDadcJhxtis5DMLDX4I28aus1-MsQF-8OV9DivSf92r8P13fX3B3oGOF26I9RAL405hGGmoLmPV-iCtHWAk7fqVqmMLuBY5MsxpJNZY88x7vBlQ1-57jFKYqJDA8JCC~4bIWsnevAQjBgQJVa9WvUxVj1E0t6ta84fN0M~ydRmB8POFzGgI3oMchOaO7Ty8hpjdkR0mr0Z7tg6cMOtkFXsUWluDtKrwb9mhCTwB5Kd7kSwnPXDzMSieom92quGUSGhhuGbSyaJQ02s~efpk15nvPELfhgA__",
        postImage2:"https://s3-alpha-sig.figma.com/img/bb54/d687/5eb9043d9e4a393c4e490cecfba24476?Expires=1733097600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=bR5bnIPWF3hCGYXIOqQZZlMY3LlNi1inWj9e5X8P-nZKks3MQigIFicr2ftezvQPrtQglpHB~BhXsxxa~vlNn-ysqZ0GyC1Vj4CjA1SstZcwEWcul6wA5l1GNBnvOzB54vnLFyviR8Q1F7ZU~V5PtfFIq91kp~jlmnp1rtEsu57Hqe-05YygJv2TX~XIAbXmoHrdg4wRn6OSS4XPTsQJOUY7cviSVpmibl34k6CmI4L~P-a3a0~ULP8JxvUanXBh5aJDr7foOR82g50EBlOVm5HZiqv2Rt7sPI4nQ4xCknRnU5pQ9i6X-ytH0CoJEgKilCMYMaSaqY5ysXNw~Vob6w__",
        comment:"120",
        likes: "5k",
        shares: "120",
    },
    {
        id: "2",
        name: "Kwame Kay",
        time: "22 hours ago",
        description:"Lorem ipsum dolor sit amet consectetur. Et aliquet ipsum ut amet sit interdum. Ullamcorper duis at dignissim tincidunt elit. Arcu orci ac porta pretium orci faucibus. Ferme adipiscing non suscipit feugiat tortor quam. Lacus in velit urna tempus magna velit cursus. Malesuada cursus leo aenean feugiat. Tincidunt arcu ullamcorper odio sed lorem. Sagittis nam scelerisque in id mauris cras non molestie. Vitae diam proin fames integer egestas vivamus luctus enim.",
        profileImage:"https://s3-alpha-sig.figma.com/img/a0bf/14eb/80e3278d642122f2264538a97367ef3e?Expires=1733097600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=U4DqUztW2Q3P6l7s4PGJOGnr7QNcgFDTB2P5i4zeOSjqC2SV-450uvHA-SayAnINKgJmAZdBxJG9MmCAMheIGsPgw6IFV1bcRFlWRBR6tKUBCAD2F3mz9p4tzMeRFgt47n8tIBxwWSW2pD0kwkMmaNr7lN6-M~5kOt0ngEbmXJaq1JpRW6Wo9fmtduS0i6MXQQnisxXWGtDOXAOGaVfNx2qDUow3qVnJkPuqD9mEak96pSwrLQwVQfkGOm4RGfrYtJd-v-xkZ9XRnAgxlJMLv58k21R4L4BdKp-Tnk0IMc14jvy0DVf-5A~xHSUWxHE-i5eCfIyi1PZILInCmst7PQ__",
        postImage1:"",
        postImage2: "",
        comment:"120",
        likes: "5k",
        shares: "120",
      },
      {
        id: "3",
        name: "Kwame Kay",
        time: "22 hours ago",
        description: "Lorem ipsum dolor sit amet consectetur. Turpis id bibendum proin vivamus.",
        profileImage:"https://s3-alpha-sig.figma.com/img/0977/2860/cd1669126a4abb5b1612dd9574aca3e5?Expires=1733097600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=A93RZOYGWJNWY1NYQlOntYqiZVaenKLaG1U9A~PUp4DKeWZdNe4SyMSzQMdGVPdqs4KsQ7neBzhqxBG9zf1kWweWj33~0-WFTZ0WFAorMY5V88mUfEXLNIWPVYNnjOccb2LPmpXwmWPPlmz2yqew9YKWdUH4TFf19egVKJVtiUunESTE6haLY~8Y-n8V-Tl-oadIQQpbKOp1A0Zrr47n9zdZSVbZb0aOhXjAWwbxQyDzNnw3nBsScrrJGbUeTz~XpZt~3qKhpnn3z4yjGAMaatEYHXL7Rqug3Ihz9y8Hv8b13bgx5JlpqreH9EEew4xN6ixpedvRRyHSPBVsvLCm7A__",
        postImage1:"https://s3-alpha-sig.figma.com/img/1198/48ec/4194f92a1c2ae1cea3c13c0af0ff2545?Expires=1733097600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=ipUGbP0440xvMNcZulSmnZqsoA2NPT5l7GQNinfqYZCwcqKu4W-OPgw7BwrXQlO0jlw1MuCnnrqmE6AjqJuuHBu5mJGee79ASiS8TH-220CqdY87aUn0Ytp5PoDRagRLHEl4VsUIwOqCSri2ooCbZc5F0gf~b2dxFy7CFR5pSNOPE1RhzppRnR5Njq8wfk8eEqEeSh3LxGm7E~xs~nO6hY5HRzI1AiS~Dikl5WdYTVpC~0G4cgSg70qR9eloIS0kCxwGwagKAHrpjlKCwUdiB~ivZS4JJj-4ZMvMKhr6-jG7njD-tfVtMQo4cddgH0NTrB53upmMO~db7-YkyW6gCg__",
        postImage2: "",
        comment:"120",
        likes: "5k",
        shares: "120",
      },

      

      
];

export const recent_posts: Recent_Post[] = [
  {
      id: "0",
      name: "Alison Botar",
      time: "22 hours ago",
      description: "Lorem ipsum dolor sit amet consectetur. Et aliquet ipsum ut amet sit interdum. Ullamcorper duis at dignissim tincidunt elit. Arcu orci ac porta pretium orci faucibus. Ferme adipiscing non suscipit feugiat tortor quam. Lacus in velit urna tempus magna velit cursus. Malesuada cursus leo aenean feugiat. Tincidunt arcu ullamcorper odio sed lorem. Sagittis nam scelerisque in id mauris cras non molestie. Vitae diam proin fames integer egestas vivamus luctus enim.",
      profileImage:"https://s3-alpha-sig.figma.com/img/8fc2/147c/b5363b5cd09abc3bae8f93f93826a7dc?Expires=1733097600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=V09Tg3uS7fOU5xDe69l69A-8AbzRmu0RTs9KBCBpTwYJVRAR-PugeV4WX0BXBKRpciroFVuuxC4GIRZ9oSZDzGkBQcmDgMAI-wuoaQ~JaPhfW58K-vhC-A~E6WOl6bh5ikbzLlhiib1JZwLv2m5JTy3I2W19eFfVQgyEECtYlmNK4Lc98Tg61AwycnvQ4Od391JuZrq4weK0nu4wOjS7jHmKMbGzxRrJHacCHFS0v7MH8IgW9fBWooCSby1H9IIiEpdkykbbGhKnaotIevt47mgP1MJEax-M-a6Vxu24RyMGo8YRQW6RiFUNmBZR7k51ObIWP~lED53k-ap2r3ySHA__",
      postImage1:"https://s3-alpha-sig.figma.com/img/a788/0ed9/5ec70a9603e7ff04a64c276a5bf6987c?Expires=1733097600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=aWZuRxXK35qv-4NJtpZCR90p6mpZfY7XRchb4rw7JuqpRGBrdGxsMGMyZDadcJhxtis5DMLDX4I28aus1-MsQF-8OV9DivSf92r8P13fX3B3oGOF26I9RAL405hGGmoLmPV-iCtHWAk7fqVqmMLuBY5MsxpJNZY88x7vBlQ1-57jFKYqJDA8JCC~4bIWsnevAQjBgQJVa9WvUxVj1E0t6ta84fN0M~ydRmB8POFzGgI3oMchOaO7Ty8hpjdkR0mr0Z7tg6cMOtkFXsUWluDtKrwb9mhCTwB5Kd7kSwnPXDzMSieom92quGUSGhhuGbSyaJQ02s~efpk15nvPELfhgA__",
      postImage2: "https://s3-alpha-sig.figma.com/img/bb54/d687/5eb9043d9e4a393c4e490cecfba24476?Expires=1733097600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=bR5bnIPWF3hCGYXIOqQZZlMY3LlNi1inWj9e5X8P-nZKks3MQigIFicr2ftezvQPrtQglpHB~BhXsxxa~vlNn-ysqZ0GyC1Vj4CjA1SstZcwEWcul6wA5l1GNBnvOzB54vnLFyviR8Q1F7ZU~V5PtfFIq91kp~jlmnp1rtEsu57Hqe-05YygJv2TX~XIAbXmoHrdg4wRn6OSS4XPTsQJOUY7cviSVpmibl34k6CmI4L~P-a3a0~ULP8JxvUanXBh5aJDr7foOR82g50EBlOVm5HZiqv2Rt7sPI4nQ4xCknRnU5pQ9i6X-ytH0CoJEgKilCMYMaSaqY5ysXNw~Vob6w__",
      postImage3: "https://s3-alpha-sig.figma.com/img/bb54/d687/5eb9043d9e4a393c4e490cecfba24476?Expires=1733097600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=bR5bnIPWF3hCGYXIOqQZZlMY3LlNi1inWj9e5X8P-nZKks3MQigIFicr2ftezvQPrtQglpHB~BhXsxxa~vlNn-ysqZ0GyC1Vj4CjA1SstZcwEWcul6wA5l1GNBnvOzB54vnLFyviR8Q1F7ZU~V5PtfFIq91kp~jlmnp1rtEsu57Hqe-05YygJv2TX~XIAbXmoHrdg4wRn6OSS4XPTsQJOUY7cviSVpmibl34k6CmI4L~P-a3a0~ULP8JxvUanXBh5aJDr7foOR82g50EBlOVm5HZiqv2Rt7sPI4nQ4xCknRnU5pQ9i6X-ytH0CoJEgKilCMYMaSaqY5ysXNw~Vob6w__",
      comment:"120",
      likes: "5k",
      shares: "120",
    },
  ]

  export const announcement: Announcement[] = [
    {
  id: "0",
  title: "Flood Alert – High Risk Zones",
  date: "Thursday 20 November 2024",
  description: "Heavy rains have caused rising water levels in low-lying areas. Avoid flooded paths and follow safety updates.",
  profileImage: "https://res.cloudinary.com/dikrqlovc/image/upload/v1763725286/default_lp2rfk.jpg"
},
{
  id: "1",
  title: "Fire Outbreak Warning – Market Centers",
  date: "Thursday 20 November 2024",
  description: "Small fire incidents reported in trading areas. Ensure all electricals are switched off after business hours.",
  profileImage: "https://res.cloudinary.com/dikrqlovc/image/upload/v1763725390/Fire-outbreak_x0wlns.jpg"
},
{
  id: "2",
  title: "Road Hazard – Oil Spill Reported",
  date: "Thursday 20 November 2024",
  description: "A major oil spill has made a section of the motorway slippery. Motorists should slow down and use alternate routes.",
  profileImage: "https://res.cloudinary.com/dikrqlovc/image/upload/v1763725457/Oil-spill-cleanup-Freshwater-West-Bay-Dyfed-Wales-1995_p2i5g2.png"
},
{
  id: "3",
  title: "Strong Wind Alert – Coastal Areas",
  date: "Thursday 20 November 2024",
  description: "Strong coastal winds expected. Secure all loose outdoor items and avoid walking near weak structures.",
  profileImage: "https://res.cloudinary.com/dikrqlovc/image/upload/v1763725515/Paradise-Blog-Photos-2-27_pizfxr.jpg"
},
{
  id: "4",
  title: "Heatwave Advisory – Stay Hydrated",
  date: "Thursday 20 November 2024",
  description: "Temperatures remain high. Limit outdoor activities and check on children, the elderly, and vulnerable persons.",
  profileImage: "https://res.cloudinary.com/dikrqlovc/image/upload/v1763725547/2048_hkjwaf.webp"
}
    ]
