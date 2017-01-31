var postcss = require('postcss');
var _ = require('lodash');
var mkdirp = require('mkdirp');
var path = require('path');
var fs = require('fs');
var crypto = require('crypto');

module.exports = postcss.plugin('postcss-process-classnames', (opts) => {
  opts = opts || {};
  return (css, result) => {
    var output = {};

    css.walkRules((rule) => {
      var matches = rule.selector.match(/\.([\w-]+)/g);
      var newSelector = rule.selector;

      if (!matches) return;

      matches.map((item, index) => {
        var hashedClass = 'c' + crypto.createHash('md5').update(item).digest('hex').substr(0, 8);
        var className = item.replace('.', '');
        
        output[className] = hashedClass;
        newSelector = newSelector.replace(item, '.' + hashedClass);
      });

      rule.selector = newSelector;

      // console.log('rule:', rule.selector);
      // console.log('rule:', newSelector);
      // console.log(matches);
      // console.log('---');
    });

    // console.log('output', output);

    if (_.isString(opts.file)) {
      mkdirp.sync(path.dirname(opts.file));
      fs.writeFileSync(opts.file, JSON.stringify(output, null, 2));
    }
  };
});
