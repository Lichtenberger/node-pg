const express = require('express')
const router = new express.Router()
const db = require('../db')
const { resourceLimits } = require('worker_threads')
const ExpressError = ('../expressError')

router.get('/', async function(req, res, next) {
    try {
        const bizQuery = await db.query('SELECT code, name FROM biztime')
        return res.json({ companies: result.rows})
    } catch (e) {
        return next(e)
    }
})

router.get('/:code', async (req,res,next) => {
    try {
        const { code } = req.params
        const results = await db.query('SELECT * from companies WHERE code = $1', [code])
        if (results.rows.length === 0) {
            throw new ExpressError(`Can't find company with code ${code}`, 404)
        return res.send({ companies: results.rows[0] })
        }
    } catch(e) {
        return next(e)
    }
})

router.post('/', async (req,res,next) => {
    try {
        const { code, name, description } = req.body
        const results = await db.query('INSERT INTO companies (code, name, description) VALUES ($1, $2, $3) RETURNING code, name, description', [code, name, description])
        return res.status(201).json({ companies: results.rows[0]})
    } catch(e) {
        return next(e)
    }
})

router.put('/', async (req,res,next) => {
    try {
        const { code } = req.params
        const { name, description } = req.body
        const results = await db.query("UPDATE companies SET name=$1, description=$2 RETURNING name, description, code", [name, description, code])
        if (results.rows.length === 0) {
            throw new ExpressError(`Can't update company with code ${code}`, 404)
        }
        return res.send({ companies: results.rows[0] })
    } catch(e) {
        return next(e)
    }
})

router.delete('/:code', async (req,res,next) => {
    try {
        const results = db.query('DELETE FROM companies WHERE code = $1', [req.params.code])
        return res.send({ msg: `Deleted ${code}`})
    } catch(e) {
        return next(e)
    }
})

module.exports = router