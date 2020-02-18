const app = require('express')()
    , http = require('http').Server(app)
    , fs = require('fs-extra')
    , { spawn } = require('child_process')
    ;
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/print', function (req, res) {
    const content =
        `rN
q1000
N
A100,20,0,2,1,1,N,"Anexo-14"
A400,50,0,2,1,1,N,"N PP-04 Revisao: 04"
A50,100,0,3,1,2,N,"IDENTIFICACAO E STATUS DO VOLUME ID 456896"
A50,150,0,3,1,2,N,"OP MAE:"
A240,150,0,2,1,2,N,"OP123"
A400,150,0,3,1,2,N,"Formulacao:"
A400,150,0,2,1,2,N,"28/01/2020"
A50,200,0,3,1,2,N,"Produto:"
A50,250,0,2,1,2,N,"12797/1 Erva Mate Picolo 1 kg"
A50,300,0,3,1,2,N,"Cor:"
A50,350,0,2,1,2,N,"302137/1 Cyan RT LAM/LAMINACAO"
A50,400,0,3,1,2,N,"Colorista:"
A180,400,0,2,1,2,N,"TURNO C"
A400,400,0,3,1,2,N,"Lote:"
A530,400,0,2,1,2,N,"1256987"
A100,450,0,2,1,2,N,"[  ] CER      [  ] GEL      [  ] LAM"
P
`;
    fs.writeFileSync(__dirname + '/content.txt', content);
    spawn(`copy ${__dirname}\\content.txt /B "${process.env.PRINTER_LOCATION}"`, [], { shell: true });
    res.json({ status: 'OK' });
});

http.listen(process.env.NODE_PORT, function () {
    console.log('Server UP', 'PID ' + process.pid);
});