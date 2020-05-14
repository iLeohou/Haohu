const Haohu = require('../index');
const app = Haohu();

app.get('/', (req, res) => {
    res.end("667")
})
console.log()
app.listen(3000, () => {
    console.log("listening 3000")
});