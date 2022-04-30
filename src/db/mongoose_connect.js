const mongoose = require('mongoose')

mongoose.connect(process.env.MONGOSE_URL, {

    useNewUrlParser: true,
    // useCreateIndex: true

})