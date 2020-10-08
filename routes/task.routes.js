const router = require("express").Router();
const passport = require("passport");

const { ObjectId } = require("mongoose").Types;

const Task = require("../models/Task.model");
const Project = require("../models/Project.model");

// REST

// REpresentational State Transfer

// Uma API é considerada RESTful quando ela adere às regras do REST

// GET => Buscar dados (cRud) READ
// JSON API especifica que a resposta para requisições GET sem parametro de rota devem retornar uma lista de todas as entidades e o Status HTTP 200 OK
// router.get("/task", async (req, res) => {
//   try {
//     const result = await Task.find().populate("tasks");

//     return res.status(200).json(result);
//   } catch (err) {
//     return res.status(500).json({ error: err });
//   }
// });

// JSON API especifica que a resposta para requisições GET com parametro de rota devem retornar a entidade buscada ou nada e o Status HTTP 200 OK
router.get(
  "/task/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { id } = req.params;

      const result = await Task.findOne({ _id: id }).populate("tasks");

      if (result) {
        return res.status(200).json(result);
      }

      return res.status(404).json({ msg: "Document not found" });
    } catch (err) {
      return res.status(500).json({ error: err });
    }
  }
);

// POST => Enviar dados (Crud) CREATE
// A JSON API especifica que o valor de resposta de requisições do tipo POST deve ser a entidade criada, e o Status HTTP deve ser 201 CREATED
router.post(
  "/task/:projectId",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      console.log(req.body);

      const resultTask = await Task.create(req.body);

      // Atualiza a lista de tarefas do projeto pra adicionar a tarefa criada
      const resultProj = await Project.findOneAndUpdate(
        { _id: req.params.projectId },
        { $push: { tasks: resultTask._id } },
        { new: true }
      );

      console.log(resultTask);
      return res.status(201).json({ created: { resultTask, resultProj } });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: err });
    }
  }
);

// PUT => Atualizar dados (crUd) UPDATE (destrutivo)
// JSON API especifica que requisições to tipo PUT devem retornar a entidade atualizada e Status HTTP 200 OK. Deve substituir o documento no banco
router.put(
  "/task/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      console.log(req.body);

      const { id } = req.params;

      const result = await Task.findOneAndReplace({ _id: id }, req.body, {
        new: true,
      });

      console.log(result);

      return res.status(200).json(result);
    } catch (err) {
      return res.status(500).json({ error: err });
    }
  }
);

// PATCH => Atualizar dados (crUd) UPDATE (nāo-destrutivo)
// JSON API especifica que requisições to tipo PATCH devem retornar a entidade atualizada e Status HTTP 200 OK. Nāo deve substituir o documento no banco
router.patch(
  "/task/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      console.log(req.body);

      const { id } = req.params;

      const result = await Task.findOneAndUpdate({ _id: id }, req.body, {
        new: true,
      });

      console.log(result);

      return res.status(200).json(result);
    } catch (err) {
      return res.status(500).json({ error: err });
    }
  }
);

// DELETE => Apagar dados (cruD) DELETE
// JSON API especifica que requisições do tipo DELETE nāo retornam nada na resposta e retornam o Status HTTP 200
router.delete(
  "/task/:projectId/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      console.log(req.body);

      const { id, projectId } = req.params;

      const result = await Task.deleteOne({ _id: id });

      // Atualiza a lista de tarefas do projeto pra retirar a tarefa deletada
      const updatedProject = await Project.findOneAndUpdate(
        { _id: projectId },
        { $pull: { tasks: { $in: [ObjectId(id)] } } }
      );

      console.log(result);

      return res.status(200).json({});
    } catch (err) {
      return res.status(500).json({ msg: "Internal server error" });
    }
  }
);

// APIs RESTful precisam ser Stateless (Não guarda nenhum state no servidor)

module.exports = router;
