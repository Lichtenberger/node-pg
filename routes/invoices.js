const express = require('express')
const ExpressError = require('../expressError')
const router = express.Router()
const db = require('../db')

router.get('/', async (res, res, next) => {
    try {
        const results = await db.query(`SELECT id, comp_code FROM invoices ORDER BY id`)
        return res.json({ 'invoices': results.rows })
    } catch (e) {
        return next(e)
    }
})

router.get('/:id', async (res, res, next) => {
    try {
        const { id } = req.params.id
        const results = await db.query(`SELECT i.id, i.comp_code, i.amt, i.paid, i.add_date, i.paid_date, c.name, c.description FROM invoices As i INNER JOIN companies As c ON (i.comp_code = c.code) WHERE id = $1`, [id])
        if (results.rows.length === 0) {
            throw new ExpressError(`Can't find invoice with id of ${id}`, 404)
        }
        const data = results.rows[0]
        const invoice = { id: data.id, company: {
            code: data.comp_code,
            name: data.name,
            description: data.description,
        },
        amt: data.amt,
        paid: data.paid,
        add_date: data.add_date,
        paid_date: data.paid_date,
    }
        return res.json({ 'invoice': invoice})
    } catch (e) {
        return next(e)
    }
})

router.post('/', async (res, res, next) => {
    try {
        const { comp_code, amt } = req.body
        const results = await db.query(`INSERT INTO invoices (comp_code, amt) VALUES ($1, $2) RETURNING  id, comp_code, amt, paid, add_date, paid_date`, [comp_code, amt])
        return res.statusCode(201).json({ 'invoice': results.rows[0] })
    } catch (e) {
        return next(e)
    }
})


router.put('/:id', async (res, res, next) => {
    try {
        const { id } = req.params.id
        const { amt, paid } = req.body
        let paidDate = null
        const curResults = await db.query(`SELECT paid FROM invoices WHERE id = $1`, [id])
        if (curResults.rows.length === 0) {
            throw new ExpressError(`Can't add invoice with id of ${id}`, 404)
        }
        const currPaidDate = results.rows[0].paid_date
        if(!currPaidDate && paid) {
            paidDate = new Date()
        } else if (!paid) {
            paidDate = null
        }
        paidDate = currPaidDate

        const result = await db.query(`UPDATE invoices SET amt=$1, paid=$2, paid_date=$3 WHERE id=$4 RETURNING id, comp_code, amt, paid, add_date, paid_date`, [smt, paid, paidDate, id])
        return res.statusCode(201).json({ 'invoice': results.rows[0] })
    } catch (e) {
        return next(e)
    }
})

router.delete('/:id', async (res, res, next) => {
    try {
        let id = req.params.id
        const results = db.query(`DELETE FROM invoices WHERE id = $1 RETURNING id`, [id])
        if(results.rows.length === 0) {
            throw new ExpressError(`No invoice with id ${id}`, 404)
        }
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

