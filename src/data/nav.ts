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
      "name": "About us",
      "path": "about"
    }
  ] as const
}


export type PageRoutes = (typeof Routes.nav)[number]["path"];

export default Routes;
