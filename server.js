const app = require('express')()
    , http = require('http').Server(app)
    , fs = require('fs-extra')
    , { execFileSync } = require('child_process')
    ;

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

const getEmptyFields = function (data, fieldsrequired) {
    let invalidfields = [];
    if (!data) {
        return fieldsrequired;
    } else {
        for (let i = 0; i < fieldsrequired.length; i++) {
            if (!(fieldsrequired[i] in data && data[fieldsrequired[i]])) {
                invalidfields.push(fieldsrequired[i]);
            }
        }
        return invalidfields;
    }
}

app.get('/print/:setor', (req, res) => {
    try {
        const setor = (req.params.setor || '').toUpperCase();
        const printlocation = process.env['PRINTER_' + setor];
        if (!printlocation) {
            return res.json({ success: false, msg: `PRINTER_${setor} não configurada` });
        }
        let content = '';
        if (setor == 'REB') {
            const invalidfields = getEmptyFields(req.query, [
                'op'
                , 'pedido'
                , 'produto'
                , 'operador'
                , 'qtd'
                , 'data'
                , 'turno'
                , 'descricao'
                , 'validade'
                , 'tara'
            ]);
            if (invalidfields.length > 0)
                return res.json({ success: false, msg: `Necessários informar os seguintes campos: ${invalidfields.join(',')}` });
            const q = req.query;
            const qtd = parseInt(req.query.qtd);
            for (let i = 0; i < qtd; i++) {
                content +=
                    `rN
q1000
N
A100,20,0,2,1,1,N,"PLASTRELA EMBALAGENS FLEXIVEIS LTDA."
A100,60,0,2,1,1,N,"${q.descricao.substring(0, 51)}"
A100,100,0,2,1,1,N,"${q.descricao.substring(51, 102)}"
A105,140,0,3,1,1,N,"Pedido: ${q.pedido}  Produto: ${q.produto}  OP: ${q.op}"
A100,180,0,2,1,1,N,"Data    : ${q.data}  Operador  : ${q.operador}"
A100,220,0,2,1,1,N,"Turno   : ${q.turno}"
A350,220,0,3,1,1,N,"N. Bobina ____ Tara  : ${q.tara}"
A105,260,0,3,1,1,N,"        Produto valido por ${q.validade} meses"
P
`;
            }
        } else if (setor == 'CS') {
            const invalidfields = getEmptyFields(req.query, [
                'op'
                , 'pedido'
                , 'produto'
                , 'operador'
                , 'qtd'
                , 'data'
                , 'turno'
                , 'descricao'
                , 'validade'
                , 'tara'
            ]);
            if (invalidfields.length > 0)
                return res.json({ success: false, msg: `Necessários informar os seguintes campos: ${invalidfields.join(',')}` });
            const q = req.query;
            const qtd = parseInt(req.query.qtd);
            for (let i = 0; i < qtd; i++) {
                content +=
                    `rN
q1000
N
A190,20,0,2,1,1,N,"PLASTRELA EMBALAGENS FLEXIVEIS LTDA."
A190,50,0,2,1,1,N,"${q.descricao.substring(0, 51)}"
A190,80,0,2,1,1,N,"${q.descricao.substring(51, 102)}"
A195,110,0,3,1,1,N,"Pedido: ${q.pedido}  Produto: ${q.produto}  OP: ${q.op}"
A190,140,0,2,1,1,N,"Data    : ${q.data}  Operador  : ${q.operador}"
A190,170,0,2,1,1,N,"Turno   : ${q.turno}"
A400,200,0,3,1,1,N,"N. Bobina ____ Tara  : ${q.tara}"
A195,230,0,3,1,1,N,"        Produto valido por ${q.validade} meses"
P
`;
            }
        } else {
            return res.json({ success: false, msg: `${setor} sem impressão configurada` });
        }
        fs.writeFileSync(__dirname + '/content.txt', content);
        fs.writeFileSync(__dirname + '/exec.bat', `copy "${__dirname}\\content.txt" /B "${printlocation}"`);
        execFileSync(__dirname + '/exec.bat')
        res.json({ success: true });
    } catch (err) {
        console.error(err);
    }
});

http.listen(process.env.NODE_PORT, function () {
    console.log('Server UP', 'PID ' + process.pid);
});