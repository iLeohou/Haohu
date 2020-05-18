const Haohu = require('../index');
const app = Haohu();

app.get('/', (req, res, next) => {
    next();
})
.get('/', (req, res, next) => {
    res.send("666")
})



app.listen(3000, () => {
    console.log("listening 3000")
});