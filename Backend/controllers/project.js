'use strict'

var Project = require('../models/project');
var fs = require('fs');

var controller = {
    home: (req, res) => {
        return res.status(200).send({
            message: "Soy la home"
        });
    },

    test: (req, res) => {
        return res.status(200).send({
            message: "Soy el método o acción test"
        });
    },

    saveProject: function(req, res){
        var project = new Project();

        var params = req.body;

        project.name = params.name;
        project.description = params.description;
        project.category = params.category;
        project.year = params.year;
        project.langs = params.langs;
        project.image = null;

        project.save((err, projectStored) => {
            if(err) return res.status(500).send({message: "Error al guardar el documento"});

            if(!projectStored) return res.status(404).send({message: "No se ha podido guardar el proyecto"});
            
            return res.status(200).send({project: projectStored});
        });
        
    },

    
    
    getProject: function (req, res){
        var projectId = req.params.id;

        if(projectId == null){
            return res.status(404).send({message: "El proyecto no existe"});
        }

        Project.findById(projectId, (err, project) => {
            if(err) return res.status(500).send({message: "Error al devolver los datos"});

            if(!project) return res.status(404).send({message: "El proyecto no existe"});

            return res.status(200).send({
                project: projectStored
            });
        });
    },
    
    getProjects: function (req, res){
        Project.find({}).sort("-year").exec((err, projects) => {
            if(err) return res.status(500).send({message: "Error al devolver los datos"});

            if(!projects) return res.status(404).send({message: "No hay proyectos para mostrar"});

            return res.status(200).send({projects});
        });
    },

    updateProject: function (req,res){
        var projectId = req.params.id;
        var update = req.body;

        if(projectId == null){
            return res.status(404).send({message: "El proyecto no existe"});
        }

        Project.findByIdAndUpdate(projectId, update, {new: true},(err, projectUpdated) => {
            if(err) return res.status(500).send({message: "Error al actualizar"});

            if(!projectUpdated) return res.status(404).send({message: "El proyecto no existe"});

            return res.status(200).send({
                project: projectUpdated
            });
        });
    },
    deleteProject: function (req,res) {
        var projectId = req.params.id;

        if(projectId == null){
            return res.status(404).send({message: "El proyecto no existe"});
        }

        Project.findByIdAndRemove(projectId, (err, projectDeleted) => {
            if(err) return res.status(500).send({message: "Error al borrar"});

            if(!projectDeleted) return res.status(404).send({message: "El proyecto no existe"});

            return res.status(200).send({
                project: projectDeleted,
                message: "Proyecto borrado"
            });
        }); 
    },
    uploadImage: function(req,res){
        var projectId = req.params.id;
        var file_name = "Imagen no subida...";

        if(req.files){
            
            var filePath = req.files.image.path;
            var fileSplit = filePath.split('\\');
            var file_name = fileSplit[1];
            var extSplit = file_name.split('\.');
            var fileExt = extSplit[1];

            if(fileExt == "png" || fileExt == "jpg" || fileExt == "jpeg" || fileExt == "gif" ){
                Project.findByIdAndUpdate(projectId, {image: file_name}, {new:true}, (err, projectUpdated) => {
                    if(err) return res.status(500).send({message: "La imagen no se ha subido"});
    
                    if(!projectUpdated) return res.status(404).send({message: "El proyecto no existe"});
    
                    return res.status(200).send({
                        project: projectUpdated
                    });
                });
            }else{
                fs.unlink(filePath, (err) => {
                    return res.status(200).send({message: "La extensión no es válida"});
                });
            }

        }else{
            return res.status(200).send({
                message: file_name
            });
        }
    }

};

module.exports = controller;