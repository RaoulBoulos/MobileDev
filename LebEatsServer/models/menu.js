const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

const commentsSchema = new Schema({
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    }, comment: {
        type: String,
        required: true
    }, author: {
        type: String,
        required: true
    }
}, {timestamps: true});
const menuSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },image: {
        type: String,
        required: true
    },category: {
        type: String,
        required: true
    },label: {
        type: String,
        default: ''
    },price: {
        type: Currency,
        required: true,
        min: 0
    },featured: {
        type: Boolean,
        default: false
    },
    description: {
        type: String,
        required: true
    },
    comments: [commentsSchema]
},{
    timestamps: true
});

var Menu = mongoose.model('Menu', menuSchema);

module.exports = Menu;