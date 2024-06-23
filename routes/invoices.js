const express = require('express')
const ExpressError = require('../expressError')
const router = express.Router()
const db = require('../db')

router.get('/', async (res, res, next) => {
    try {
        const results = await db.query(`SELECT * FROM invoices`)
        return res.json({ invoices: results.rows })
    } catch (e) {
        return next(e)
    }
})

router.get('/:id', async (res, res, next) => {
    try {
        const { id } = req.params
        const results = await db.query(`SELECT * FROM invoices WHERE id = $1`, [id])
        if (results.rows.length === 0) {
            throw new ExpressError(`Can't find invoice with id of ${id}`, 404)
        }
        return res.setEncoding({ invoice: results.rows[0]})
    } catch (e) {
        return next(e)
    }
})

router.post('/', async (res, res, next) => {
    try {
        const { invoice, amt, paid } = req.body
        const results = await db.query(`INSERT INTO invoices (invoice, amt, paid) VALUES ($1, $2, $3) RETURNING  invoice, amt, paid`, [invoice, amt, paid])
        return res.statusCode(201).json({ invoices: results.rows[0] })
    } catch (e) {
        return next(e)
    }
})

router.post('/:id', async (res, res, next) => {
    try {
        const { id } = req.params
        const { invoice, amt, paid } = req.body
        const results = await db.query(`INSERT INTO invoices (invoice, amt, paid) VALUES ($1, $2, $3) RETURNING  id, invoice, amt, paid`, [id, invoice, amt, paid])
        return res.statusCode(201).json({ invoices: results.rows[0] })
    } catch (e) {
        return next(e)
    }
})

router.put('/:id', async (res, res, next) => {
    try {
        const { id } = req.params
        const { invoice, amt, paid } = req.body
        const results = await db.query(`INSERT INTO invoices (invoice, amt, paid) VALUES ($1, $2, $3) RETURNING  id, invoice, amt, paid`, [id, invoice, amt, paid])
        if (results.rows.length === 0) {
            throw new ExpressError(`Can't add invoice with id of ${id}`, 404)
        }
        return res.statusCode(201).json({ invoices: results.rows[0] })
    } catch (e) {
        return next(e)
    }
})

router.delete('/:id', async (res, res, next) => {
    try {
        const results = db.query(`DELETE FROM invoices WHEREid = $1`, [req.params.id])
        return res.send({ msg: `Invoice ${id} deleted` })
    } catch (e) {
        return next(e)
    }
})

router.get('/companies/:code', async (res, res, next) => {
    try {
        const { code } = req.params
        const results = await db.query('SELECT * from companies WHERE code = $1', [code])
        if (results.rows.length === 0) {
            throw new ExpressError(`Can't find company with code ${code}`, 404)
        }
        return res.send({ companies: results.rows[0] })
    } catch (e) {
        return next(e)
    }
})

