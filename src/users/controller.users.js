import { Router } from "express";

const router = Router();

router.get('/', async (req, res) => {
    res.json({message: 'users GET'});
});

router.post('/', async (req, res) => {
    res.json({message: 'users POST'});
});

router.put('/', async (req, res) => {
    res.json({message: 'users PUT'});
});

router.patch('/', async (req, res) => {
    res.json({message: 'users PATCH'});
});

router.delete('/', async (req, res) => {
    res.json({message: 'users DELETE'});
});

export default router;