import { Router } from "express";

const router = Router();

router.get('/', async (req, res) => {
    res.json({message: 'products GET'});
});

router.post('/', async (req, res) => {
    res.json({message: 'products POST'});
});

router.put('/', async (req, res) => {
    res.json({message: 'products PUT'});
});

router.patch('/', async (req, res) => {
    res.json({message: 'products PATCH'});
});

router.delete('/', async (req, res) => {
    res.json({message: 'products DELETE'});
});

export default router;