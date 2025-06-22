//מוחק אוטומטי את <style>@charset "UTF-8";</style>
// מ-dist///index.html
module.exports = {
  plugins: [
    require('postcss-discard-comments')(),
    require('postcss-discard-duplicates')(),
    {
      postcssPlugin: 'remove-charset',
      AtRule: {
        charset: (atRule) => {
          atRule.remove();
        }
      }
    }
  ]
}
