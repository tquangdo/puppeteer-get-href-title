const puppeteer = require('puppeteer'); //phải có ";"

(async () => {
    try {
        const browser = await puppeteer.launch({
            headless: false,
            // slowMo: 200,
        })
        const page = await browser.newPage()
        // await page.goto('https://page.auctions.yahoo.co.jp/jp/auction/e463685456')
        // await page.waitForSelector('.ProductInformation__items > .ProductInformation__item > .Price > .Price__body > .Price__value')
        // const tweets = await page.$$('.ProductInformation__items > .ProductInformation__item > .Price > .Price__body > .Price__value')
        // for (let i = 0; i < tweets.length; i++) {
        //     const tweet = await (await tweets[i].getProperty('innerText')).jsonValue()
        //     console.log(tweet)
        // }
        await page.goto('https://24h.com.vn')

        //1)
        // page.setViewport({ width: 1280, height: 720 })
        // // chụp ảnh màn hình và lưu lại với tên 24h.png
        // await page.screenshot({ path: '24h.png' })

        //2)
        // const dimensions = await page.evaluate(() => { //trong hàm evaluate() KO được gọi biến định nghĩa từ ngoài vào!!!
        //     return {
        //         width: document.documentElement.clientWidth,
        //         height: document.documentElement.clientHeight,
        //         deviceScaleFactor: window.devicePixelRatio
        //     }
        // })
        // console.log('Dimensions:', dimensions)

        //3)
        // page.on('console', msg => console.log(msg.text()))
        // await page.evaluate(() => console.log(`url is ${location.href}`))

        //4)
        const articles = await page.evaluate(() => {
            /*
            * <div class="colLt" >
            * <header class="nwsTit cltitbxbdtt" id="id_class_title_box_bd_tt_2">
                <a   href="https://www.24h.com.vn/tin-tuc-trong-ngay/tau-metro-dau-tien-cap-ben-tphcm-vao-ngay-5-10-toi-c46a1182722.html" title="Tàu metro đầu tiên cập bến TP.HCM vào ngày 10/10 tới" style="font-size: 14px;">Tàu metro đầu tiên cập bến TP.HCM vào ngày 10/10 tới</a>
            </header>
            */
            let titles = document.querySelectorAll("div.colLt header.nwsTit a")
            let arrTieude = []
            titles.forEach(item => {
                arrTieude.push({
                    href: item.getAttribute('href').trim(),
                    title: item.getAttribute('title').trim(),
                })
            })
            return arrTieude
        })
        const promises = [];
        for (let i = 0; i < articles.length; i++) {
            promises.push(await getTitle(articles[i].href, page, articles[i].title))
        }
        // console.log(articles)

        await browser.close()
    } catch (err) {
        console.log("ERR!!! " + err)
    }
})()

async function getTitle(arg_link, arg_page, arg_title) {
    await arg_page.goto(arg_link, {
        timeout: 3000000
    })
    // Chờ 1s sau khi page được load để tránh overload
    await arg_page.waitForTimeout(1000)

    let title = await arg_page.evaluate(() => {
        let artTitle = document.querySelector("div.clF h2.ctTp")
        let kq = (artTitle) ? artTitle.innerText : '6969'
        return kq
    })

    title = (title === '6969') ? arg_title : title
    console.log(title)
    return arg_page
}
