// получаем рандомное число от max до min
function getRandomBetween(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1));
}
// получаем в качестве аргумента один элемент из всего набора аргументов переданных в функцию
function getRandomFrom(...args) {
  const index = Math.floor(Math.random() * args.length);
  return args[index];
}
