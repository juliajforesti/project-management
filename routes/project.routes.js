const router = require("express").Router();
const passport = require("passport");

const { ObjectId } = require("mongoose").Types;

const Project = require("../models/Project.model");
const Task = require("../models/Task.model");

// REST

// REpresentational State Transfer

// Uma API é considerada RESTful quando ela adere às regras do REST

// GET => Buscar dados (cRud) READ
// JSON API especifica que a resposta para requisições GET sem parametro de rota devem retornar uma lista de todas as entidades e o Status HTTP 200 OK
router.get(
  "/project",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      // Populate automaticamente popula a array de tarefa com os respectivos documentos usando os ids no campo tasks do Model
      const result = await Project.find().populate("tasks");

      return res.status(200).json(result);
    } catch (err) {
      return res.status(500).json({ error: err });
    }
  }
);

// JSON API especifica que a resposta para requisições GET com parametro de rota devem retornar a entidade buscada ou nada e o Status HTTP 200 OK
router.get(
  "/project/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { id } = req.params;
      // Populate automaticamente popula a array de tarefa com os respectivos documentos usando os ids no campo tasks do Model
      const result = await Project.findOne({ _id: id }).populate("tasks");

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
  "/project",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      console.log(req.body);

      const result = await Project.create(req.body);

      console.log(result);
      return res.status(201).json({ created: result });
    } catch (err) {
      return res.status(500).json({ error: err });
    }
  }
);

// PUT => Atualizar dados (crUd) UPDATE (destrutivo)
// JSON API especifica que requisições to tipo PUT devem retornar a entidade atualizada e Status HTTP 200 OK. Deve substituir o documento no banco
router.put(
  "/project/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      console.log(req.body);

      const { id } = req.params;

      const result = await Project.findOneAndReplace({ _id: id }, req.body, {
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
  "/project/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      console.log(req.body);

      const { id } = req.params;

      // Esse codigo vai substituir a array de tarefas
      const result = await Project.findOneAndUpdate({ _id: id }, req.body, {
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
  "/project/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      console.log(req.body);

      const { id } = req.params;

      // Deletando todas as tarefas que fazem parte de um projeto

      console.log(id);

      // Projection para trazer apenas os ids das tarefas do banco
      const taskIds = await Project.findOne({ _id: id }, { _id: 0, tasks: 1 });

      console.log("TASK IDS => ", taskIds.tasks);

      // Deletar todas as Tasks que fazem parte deste Projeto
      const tasksDeletionResult = await Task.deleteMany({
        _id: { $in: taskIds.tasks.map((task) => ObjectId(task)) },
      });

      console.log("DELETED TASKS => ", tasksDeletionResult);

      const result = await Project.deleteOne({ _id: id });

      console.log(result);

      return res.status(200).json({});
    } catch (err) {
      return res.status(500).json({ msg: "Internal server error" });
    }
  }
);

// APIs RESTful precisam ser Stateless (Não guarda nenhum state no servidor)

module.exports = router;
