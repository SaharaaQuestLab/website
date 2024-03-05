const Routes = {
  "nav": [
    {
      "name": "Personal",
      "path": "personal"
    },
    {
      "name": "Business",
      "path": "business"
    },
    {
      "name": "Research",
      "path": "research"
    },
    {
      "name": "Ecosystem",
      "path": "ecosystem",
      "subPath": [
        {
          "name": "Blog",
          "path": "blog",
          "link": "https://blog.saharalabs.ai"
        },
        {
          "name": "Twitter",
          "path": "twitter",
          "link": "https://twitter.com/SaharaLabsAI"
        },
        {
          "name": "Discord",
          "path": "discord",
          "link": "https://discord.gg/wwY5KvYFPC"
        },
        {
          "name": "Linkedin",
          "path": "linkedin",
          "link": "https://www.linkedin.com/company/saharalabs-ai/"
        },
      ]
    },
    {
      "name": "About Us",
      "path": "aboutUs",
      "subPath": [
        {
          "name": "Team",
          "path": "team"
        },
        {
          "name": "Careers",
          "path": "career"
        }
      ]
    }
  ] as const,
}


export type PageRoutes = (typeof Routes.nav)[number]["path"];

export default Routes;
