module.exports = {
    head: [
      ['link', { rel: 'icon', href: '/logo.png' }]
    ],
    title: 'Amz Chrome Bot',
    description: 'A simple chrome extension that will navigate, search & get data from Seller Central and Amazon in every page loaded.',
    theme: 'thindark',
    themeConfig: {
      search: false,
      logo: '/logo.png',
      nav: [
        { text: 'Home', link: '/' },
        { text: 'Get Started', link: '/pages/get-started' }
      ],
      sidebar: [
          {
            title: 'Get Started',
            path: '/pages/get-started'
          },
          {
            title: 'Bulk Data Extractor',
            path: '/pages/bulk-data-extractor'
          }
          
        ],
        smoothScroll: true,
        lastUpdated: true
    },
    extraWatchFiles: ['**/*.md','**/**/*.md', '**/*.vue', '**/*.js']
  }