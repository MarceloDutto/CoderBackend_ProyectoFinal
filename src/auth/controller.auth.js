import { Router } from "express";

const router = Router();

router.get('/', async (req, res) => {
    res.json({message: 'auth GET'});
});

router.post('/', async (req, res) => {
    res.json({message: 'auth POST'});
});

router.put('/', async (req, res) => {
    res.json({message: 'auth PUT'});
});

router.patch('/', async (req, res) => {
    res.json({message: 'auth PATCH'});
});

router.delete('/', async (req, res) => {
    res.json({message: 'auth DELETE'});
});

export default router;