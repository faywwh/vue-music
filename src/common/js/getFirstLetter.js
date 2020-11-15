export function getFirstLetter(string) {
  if (!String.prototype.localeCompare) { return null; }
  var letter = ''
  var letters = "*ABCDEFGHJKLMNOPQRSTWXYZ".split('');
  var zh = "阿八嚓哒妸发旮哈讥咔垃痳拏噢妑七呥扨它穵夕丫帀".split('');
  letters.forEach((item, i) => {
    if ((!zh[i - 1] || zh[i - 1].localeCompare(string) <= 0) && string.localeCompare(zh[i]) === -1) {
      letter = item
    }
  })
  return letter
}