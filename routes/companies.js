const express = require('express')
const router = new express.Router()
const db = require('../db')
const ExpressError = ('../expressError')
const slugify = require('slugify')


router.get('/', async function(req, res, next) {
    try {
        const bizQuery = await db.query('SELECT code, name FROM companies ORDER BY name')
        return res.json({ 'companies': result.rows})
    } catch (e) {
        return next(e)
    }
})

router.get('/:code', async (req,res,next) => {
    try {
        const { code } = req.params.code
        const companyResults = await db.query('SELECT code, name, description from companies WHERE code = $1', [code])
        const invoiceResult = db.query(`SELECT id From invoices Where comp_code = $1`, [code])
        if (results.rows.length === 0) {
            throw new ExpressError(`Can't find company with code ${code}`, 404)

        const company = companyResults.rows[0]
        const invoices = (await invoiceResult).rows
        company.invoices = invoices.map(inv => inv.id)
        return res.json({ 'company': company })
        }
    } catch(e) {
        return next(e)
    }
})

router.post('/', async (req,res,next) => {
    try {
        const {  name, description } = req.body
        let code = slugify(name, {lower: true})
        const results = await db.query('INSERT INTO companies (code, name, description) VALUES ($1, $2, $3) RETURNING code, name, description', [code, name, description])
        return res.status(201).json({ 'company': results.rows[0]})
    } catch(e) {
        return next(e)
    }
})

router.put('/:code', async (req,res,next) => {
    try {
        const { code } = req.params
        const { name, description } = req.body
        const results = await db.query("UPDATE companies SET name=$1, description=$2 WHERE code = $3 RETURNING code, name, description", [name, description, code])
        if (results.rows.length === 0) {
            throw new ExpressError(`Can't update company with code ${code}`, 404)
        }
        return res.send({ 'company': results.rows[0] })
    } catch(e) {
        return next(e)
    }
})

router.delete('/:code', async (req,res,next) => {
    try {
        const code = req.params.code
        const results = db.query('DELETE FROM companies WHERE code = $1 RETURNING code', [code])
        if (results.rows.length === 0) {
            throw new ExpressError(`No company with ${code}`, 404)
        } 
        return res.send({ msg: `Deleted ${code}`})
    } catch(e) {
        return next(e)
    }
})

module.exports = router