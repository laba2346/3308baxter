//<--
//
//Import model
import {sequelize, classes} from '../models/index.js';

export function createClass(req, res){

    var name= req.body.name;
    var info= req.body.desc;
    var times= req.body.date;
    var color= req.body.color;
    var options = {
        class_name: name,
        class_info: info,
        class_color: color,
        class_times: times,
        user_id: req.user.id,

    };
    sequelize.sync().then(function(){
        classes.create(options).then(function(err){
            console.log(err)
            var response = {};
            if(err){
                response = {
                    newClass: false,
                };
            }
            else{
                response = {
                    newClass: true,
                };
            }
            res.send(response);
        });
    });
}

export function fetchClasses(req, res){
    var options = {
        where: {
            owner_id: req.user.id
        },
        order: ['class_name'],
    };
    sequelize.sync().then(function(){
        classes.findAll(options).then(function(result){
            var i = 0
            var classes = result;
            res.send(classes);
        });
    });
}
