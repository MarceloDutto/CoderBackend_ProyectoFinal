import { Router } from "express";

const router = Router();

router.get('/', async (req, res) => {
    res.json({message: 'carts GET'});
});

router.post('/', async (req, res) => {
    res.json({message: 'carts POST'});
});

router.put('/', async (req, res) => {
    res.json({message: 'carts PUT'});
});

router.patch('/', async (req, res) => {
    res.json({message: 'carts PATCH'});
});

router.delete('/', async (req, res) => {
    res.json({message: 'carts DELETE'});
});

export default router;