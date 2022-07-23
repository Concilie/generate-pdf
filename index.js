const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const puppeteer = require('puppeteer')
const stream = require('stream')
const fs = require('fs')



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.render('index.html')
})

app.get('/download', async (req, res) => {
   
    const html_file = fs.readFileSync('./public/download.html', 'utf-8')

    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.setContent(html_file)

    const pdfBuffer = await page.pdf({
        format: 'A4',
        displayHeaderFooter: true,
        headerTemplate: '',
        footerTemplate: '',
        margin: {
            top: '30px',
            bottom: '160px',
            left: '30px',
            right: '30px',
        },
    })
    await browser.close()

    // Create stream
    const newStream = new stream.PassThrough()

    // Add pdfBuffer to stream
    newStream.end(pdfBuffer)

    //for download file
    res.set('Content-disposition', 'attachment; filename=download.pdf')


    // send res to user
    newStream.pipe(res)
})



app.listen('8016', () => {
    console.log("Server listen on port 8016")
})