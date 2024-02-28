// 设置联系方式页的meta信息
const baseUrl = import.meta.env.BASE_URL;

export default {
  titles: {
    texts: [
      'The people',
      'behind sahara'
    ],
    description: 'Sahara is a human-AI collaboration network',
    remarks: [],
    button: {
      text: 'Join The Team',
      path: `${baseUrl}career`
    }
  },
  careerTitles: {
    texts: [
      'Join Sahara'
    ],
    description: 'Sahara is consistently looking for new talents.Work with the best in the industry today.',
    remarks: [],
    button: {
      text: 'Open Positions',
      path: `${baseUrl}career#positions`
    }
  }
}
