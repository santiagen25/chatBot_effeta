//para ejecutar el chatbot: node index.js

const qrcode = require('qrcode-terminal');

const { Client, LocalAuth } = require('whatsapp-web.js');

const client = new Client({
    authStrategy: new LocalAuth()
})

async function eseprarContacto(message) {
    let result = await message.getContact();
    return result;
}

client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.initialize();

client.on('message', message => {
    if(message.body.charAt(0) === '!') {
        eseprarContacto(message).then(response => console.log(response['pushname'] + " dice " + message.body));
    }
});

client.on('message_create', async (msg) => {
    // Fired on all message creations, including your own
    if (msg.body === '!calcula' || msg.body === '!calculame' || msg.body === '!records' || msg.body.startsWith('!calculale')) {

        let misas = 0;
        let misterios = 0;
        let pregarias = 0;
        let mediaHoraSantisimo = 0;
        let horaTrabajo = 0;
        let mediaHoraEstudio = 0;
        let esfuerzos = 0;
        let abstinencias = 0;
        let fraternidad = 0;

        let chats = await client.getChats();
        let allMsgChats = null;

        //const nombreActualDelGrupo = 'BOMBARDEEMOS EL CIELO ✝️🤍';
        const nombreActualDelGrupo = 'ORACIONS EFFETÁ MARESME 🙏🏻';
        const unaPersona = msg.body === '!calculame' || msg.body.includes("!calculale");
        let quePersona;
        if(unaPersona) quePersona = msg.body === '!calculame' ? (await msg.getContact()).pushname : (await client.getContactById(msg.body.substring(11,22)+'@c.us')).pushname
        let mensajesLeidos = 0;

        //cosas para records
        const isRecords = msg.body === '!records';
        //el modelo de datos es {nombre, misas,horassantas....}
        let recordsArray = []

        for(let j = 0; j < 100; j++){
            if(chats[j].isGroup && chats[j].name == nombreActualDelGrupo){
                while (chats[j].canLoadEarlierMessages) {
                    await chats[j].loadEarlierMessages();
                }
                allMsgChats = await chats[j].fetchMessages({limit: 99999});
                console.log("Se ha encontrado el grupo!");
                break;
            }
        }

        if (allMsgChats != null) {
            console.log("Leyendo mensajes...");
            for(let i = 0; i < allMsgChats.length; i++){
                //misas y cosas de esta persona en concreto
                let misasMoment = 0;
                let misteriosMoment = 0;
                let pregariasMoment = 0;
                let mediaHoraSantisimoMoment = 0;
                let horaTrabajoMoment = 0;
                let mediaHoraEstudioMoment = 0;
                let esfuerzosMoment = 0;
                let abstinenciasMoment = 0;
                let fraternidadMoment = 0;
                const quePersonaMoment = (await allMsgChats[i].getContact()).pushname

                if(unaPersona && !(quePersona === quePersonaMoment)) continue;

                //console.log("message: "+allMsgChats[i].body)
                let currentmsg = allMsgChats[i].body.replace(/(\n|\r|\s|\t)/gm, "");
                console.log("currentmsg: "+currentmsg+" by "+ (await allMsgChats[i].getContact()).pushname);

                //antes de nada, si el mensaje tiene mucho texto al empezar, descartamos el mensaje
                const ffc = currentmsg.substring(0,7)
                if(stringIncludesEmoji(ffc)) {
                    console.log("descartamos este mensaje, no se han encontrado emojis cercanos")
                    continue;
                }

                //vamos a intentar arreglar la paridad de Blanca Lauci
                if(!isNaN(currentmsg.substring(0,1)) && stringIncludesEmoji(currentmsg.substring(currentmsg.length-1,currentmsg.length))){
                    //vamos a bypasearlo por el momento, pero en el futuro la idea seria calcular a la inversa este tipo de paridad
                    currentmsg = currentmsg.replace(/[0-9]/g, '');
                }

                
                //console.log("length: "+currentmsg.length)
                //console.log("charat: "+currentmsg.charAt(k))
                //mirando cada caracter del mensaje seleccionado
                //los emoticonos son conjuntos de caracteres (en concreto 2 caracteres (32 bytes? interesante buscarlo)), hay que tratarlos como tales
                //los ifs separados, no anidados, pues una persona puede haber ido a misa y haber hecho mas cosas
                if(currentmsg.indexOf('🍞') >= 0) {
                    //existe en la string
                    let whereIsEmoji = currentmsg.indexOf('🍞');
                    if(currentmsg.substring(whereIsEmoji+2,whereIsEmoji+4) == '🍷') {
                        while(true){
                            let cantidad = calcularXCosas(currentmsg, whereIsEmoji+4);
                            console.log("aqui hay "+cantidad+" misas");
                            misas = misas + cantidad;
                            misasMoment = cantidad;
                            if(currentmsg.substring(whereIsEmoji+4,currentmsg.length).indexOf('🍞') >= 0 && currentmsg.substring(whereIsEmoji+6,currentmsg.length).indexOf('🍷') >= 0){
                                submsg = currentmsg.substring(whereIsEmoji+4,currentmsg.length);
                                //en este caso en concreto, en esta parte en concreto, no hace falta buscar el segundo emoji, pues si no lo tuviera ya no habria entrado en el IF, asi que damos por hecho que lo tiene
                                whereIsEmoji = submsg.indexOf('🍞') + whereIsEmoji + 4;
                                continue;
                            }
                            break;
                        }
                    }
                }
                if (currentmsg.indexOf('🌹') >= 0) {
                    let whereIsEmoji = currentmsg.indexOf('🌹');
                    while(true){
                        let cantidad = calcularXCosas(currentmsg, whereIsEmoji+2);
                        misterios = misterios + cantidad
                        misteriosMoment = cantidad;
                        console.log("aqui hay "+cantidad+" misterios del rosario");
                        if(currentmsg.substring(whereIsEmoji+2,currentmsg.length).indexOf('🌹') >= 0){
                            console.log("hay mas rosas!!!!");
                            submsg = currentmsg.substring(whereIsEmoji+2,currentmsg.length);
                            //solo cambiamos la iteracion (de hecho calculamos donde está), para asi no tener que cambiar el string #smart
                            whereIsEmoji = submsg.indexOf('🌹') + whereIsEmoji + 2;
                            continue;
                        }
                        break;
                    }
                }
                if (currentmsg.indexOf('🙏') >= 0) {
                    let whereIsEmoji = currentmsg.indexOf('🙏');
                    let cuanGrandeEmoji = 2;
                    while(true){
                        if(currentmsg.indexOf('🙏🏻') >= 0 || currentmsg.indexOf('🙏🏼') >= 0 || currentmsg.indexOf('🙏🏽') >= 0 || currentmsg.indexOf('🙏🏾') >= 0 || currentmsg.indexOf('🙏🏿') >= 0) {
                            cuanGrandeEmoji = 4;
                        } else {
                            cuanGrandeEmoji = 2;
                        }
                        let cantidad = calcularXCosas(currentmsg, parseInt(parseInt(whereIsEmoji) + parseInt(cuanGrandeEmoji)));
                        pregarias = pregarias + cantidad
                        pregariasMoment = cantidad;
                        console.log("aqui hay "+cantidad+" pregarias");
                        if(currentmsg.substring(whereIsEmoji+parseInt(cuanGrandeEmoji),currentmsg.length).indexOf('🙏') >= 0){
                            submsg = currentmsg.substring(whereIsEmoji+parseInt(cuanGrandeEmoji),currentmsg.length);
                            //solo cambiamos la iteracion (de hecho calculamos donde está), para asi no tener que cambiar el string #smart
                            whereIsEmoji = submsg.indexOf('🙏') + whereIsEmoji + parseInt(cuanGrandeEmoji);
                            continue;
                        }
                        break;
                    }
                        
                }
                if (currentmsg.indexOf('🕯') >= 0) {
                    let whereIsEmoji = currentmsg.indexOf('🕯');
                    while(true){
                        let cantidad = calcularXCosas(currentmsg, whereIsEmoji+2);
                        mediaHoraSantisimo = mediaHoraSantisimo + cantidad
                        mediaHoraSantisimoMoment = cantidad;
                        console.log("aqui hay "+cantidad+" medias horas al santisimo");
                        if(currentmsg.substring(whereIsEmoji+2,currentmsg.length).indexOf('🕯') >= 0){
                            submsg = currentmsg.substring(whereIsEmoji+2,currentmsg.length);
                            whereIsEmoji = submsg.indexOf('🕯') + whereIsEmoji + 2;
                            continue;
                        }
                        break;
                    }
                }
                if (currentmsg.indexOf('💪') >= 0) {
                    let whereIsEmoji = currentmsg.indexOf('💪');
                    let cuanGrandeEmoji = 2;
                    //para detectar los colores, pues la gente pone las manitas con colores diferentes
                    if(currentmsg.indexOf('💪🏻') >= 0 || currentmsg.indexOf('💪🏼') >= 0 || currentmsg.indexOf('💪🏽') >= 0 || currentmsg.indexOf('💪🏾') >= 0 || currentmsg.indexOf('💪🏿') >= 0) {
                        cuanGrandeEmoji = 4;
                    } else {
                        cuanGrandeEmoji = 2;
                    }
                    while(true){
                        let cantidad = calcularXCosas(currentmsg, parseInt(parseInt(whereIsEmoji) + parseInt(cuanGrandeEmoji)));
                        horaTrabajo = horaTrabajo + cantidad
                        horaTrabajoMoment = cantidad;
                        console.log("aqui hay "+cantidad+" horas de trabajo");
                        if(currentmsg.substring(whereIsEmoji+parseInt(cuanGrandeEmoji),currentmsg.length).indexOf('💪') >= 0){
                            submsg = currentmsg.substring(whereIsEmoji+parseInt(cuanGrandeEmoji),currentmsg.length);
                            //solo cambiamos la iteracion (de hecho calculamos donde está), para asi no tener que cambiar el string #smart
                            whereIsEmoji = submsg.indexOf('💪') + whereIsEmoji + parseInt(cuanGrandeEmoji);
                            continue;
                        }
                        break;
                    }
                }
                if (currentmsg.indexOf('📖') >= 0) {
                    let whereIsEmoji = currentmsg.indexOf('📖');
                    while(true){
                        let cantidad = calcularXCosas(currentmsg, whereIsEmoji+2);
                        mediaHoraEstudio = mediaHoraEstudio + cantidad
                        mediaHoraEstudioMoment = cantidad;
                        console.log("aqui hay "+cantidad+" medias horas de estudio");
                        if(currentmsg.substring(whereIsEmoji+2,currentmsg.length).indexOf('📖') >= 0){
                            submsg = currentmsg.substring(whereIsEmoji+2,currentmsg.length);
                            whereIsEmoji = submsg.indexOf('📖') + whereIsEmoji + 2;
                            continue;
                        }
                        break;
                    }
                }
                //console.log('🎖🥇🏅🥉🥈')
                if (currentmsg.indexOf('🎖') >= 0 ||
                            currentmsg.indexOf('🥇') >= 0 ||
                            currentmsg.indexOf('🏅') >= 0 ||
                            currentmsg.indexOf('🥉') >= 0 ||
                            currentmsg.indexOf('🥈') >= 0) {
                    //damos por hecho que aunque se equivoquen de medalla, solo pondrán una medalla (ToDo)
                    let whereIsEmoji = currentmsg.indexOf('🎖') != -1 ? currentmsg.indexOf('🎖') : (
                                currentmsg.indexOf('🥇') != -1 ? currentmsg.indexOf('🥇') : (
                                    currentmsg.indexOf('🏅') != -1 ? currentmsg.indexOf('🏅') : (
                                        currentmsg.indexOf('🥉') != -1 ? currentmsg.indexOf('🥉') : (
                                            currentmsg.indexOf('🥈')
                                        )
                                    )
                                )
                            );

                    while(true){
                        let cantidad = calcularXCosas(currentmsg, whereIsEmoji+2);
                        esfuerzos = esfuerzos + cantidad
                        esfuerzosMoment = cantidad;
                        console.log("aqui hay "+cantidad+" esfuerzos");
                        if(currentmsg.substring(whereIsEmoji+2,currentmsg.length).indexOf('🎖') >= 0 ||
                                    currentmsg.substring(whereIsEmoji+2,currentmsg.length).indexOf('🥇') >= 0 ||
                                    currentmsg.substring(whereIsEmoji+2,currentmsg.length).indexOf('🏅') >= 0 ||
                                    currentmsg.substring(whereIsEmoji+2,currentmsg.length).indexOf('🥉') >= 0 ||
                                    currentmsg.substring(whereIsEmoji+2,currentmsg.length).indexOf('🥈') >= 0){
                            submsg = currentmsg.substring(whereIsEmoji+2,currentmsg.length);
                            whereIsEmoji = submsg.indexOf('🎖') != -1 ? submsg.indexOf('🎖') :
                                        submsg.indexOf('🥇') != -1 ? submsg.indexOf('🥇') :
                                        submsg.indexOf('🏅') != -1 ? submsg.indexOf('🏅') :
                                        submsg.indexOf('🥉') != -1 ? submsg.indexOf('🥉') :
                                        submsg.indexOf('🥈')
                                        + whereIsEmoji + 2;
                            continue;
                        }
                        break;
                    }
                }
                if (currentmsg.indexOf('🚫') >= 0) {
                    let whereIsEmoji = currentmsg.indexOf('🚫');
                    while(true){
                        let cantidad = calcularXCosas(currentmsg, whereIsEmoji+2);
                        abstinencias = abstinencias + cantidad
                        abstinenciasMoment = cantidad;
                        console.log("aqui hay "+cantidad+" abstinencias");
                        if(currentmsg.substring(whereIsEmoji+2,currentmsg.length).indexOf('🚫') >= 0){
                            submsg = currentmsg.substring(whereIsEmoji+2,currentmsg.length);
                            whereIsEmoji = submsg.indexOf('🚫') + whereIsEmoji + 2;
                            continue;
                        }
                        break;
                    }
                }
                if (currentmsg.indexOf('🍻') >= 0) {
                    let whereIsEmoji = currentmsg.indexOf('🍻');
                    while(true){
                        let cantidad = calcularXCosas(currentmsg, whereIsEmoji+2);
                        fraternidad = fraternidad + cantidad
                        fraternidadMoment = cantidad;
                        console.log("aqui hay "+cantidad+" actos de fraternidad");
                        if(currentmsg.substring(whereIsEmoji+2,currentmsg.length).indexOf('🍻') >= 0){
                            submsg = currentmsg.substring(whereIsEmoji+2,currentmsg.length);
                            whereIsEmoji = submsg.indexOf('🍻') + whereIsEmoji + 2;
                            continue;
                        }
                        break;
                    }
                }

                //después de comprobar todo se deberia hacer un substring para ver si hay emojis repetidos


                // if(allMsgChats[i].body.includes('🍞🍷')) console.log("Una misa");
                // else if(allMsgChats[i].body.includes('🌹')) console.log("Un rosario");
                // else if(allMsgChats[i].body.includes('🙏')) console.log("Una plegaria");
                // else if(allMsgChats[i].body.includes('🕯')) console.log("Media hora delante del santísimo");
                // else if(allMsgChats[i].body.includes('💪')) console.log("Una hora de trabajo");
                // else if(allMsgChats[i].body.includes('📖')) console.log("Media hora de estudio o clase");
                // else if(allMsgChats[i].body.includes('🥇')) console.log("Un esfuerzo");
                // else if(allMsgChats[i].body.includes('🚫')) console.log("Una abstinencia");
                // else if(allMsgChats[i].body.includes('🍻')) console.log("Un acto de fraternidad");


                if(isRecords){
                    let seRepiteNombre = false;

                    //comprobamos si el nombre existe
                    recordsArray.forEach(function (arrayItem) {
                        if(quePersonaMoment == arrayItem.nombre) {
                            arrayItem.data[0] += misasMoment
                            arrayItem.data[1] += misteriosMoment
                            arrayItem.data[2] += pregariasMoment
                            arrayItem.data[3] += mediaHoraSantisimoMoment
                            arrayItem.data[4] += horaTrabajoMoment
                            arrayItem.data[5] += mediaHoraEstudioMoment
                            arrayItem.data[6] += esfuerzosMoment
                            arrayItem.data[7] += abstinenciasMoment
                            arrayItem.data[8] += fraternidadMoment
                            arrayItem.mensajesLeidos++

                            seRepiteNombre = true
                            return;
                        }
                    });
                    
                    if (!seRepiteNombre) {
                        recordsArray.push({
                            nombre: quePersonaMoment,
                            data: [misasMoment,misteriosMoment,pregariasMoment,mediaHoraSantisimoMoment,horaTrabajoMoment,mediaHoraEstudioMoment,esfuerzosMoment,abstinenciasMoment,fraternidadMoment],
                            mensajesLeidos: 1
                        });
                    }
                }

                mensajesLeidos++;
            }

            let mensajeRespuesta = "Recuento:\n\nMisas 🍞🍷 : *"+misas+"*\n"+
                        "Misterios del Rosario 🌹 : *"+misterios+"*\n"+
                        "Pregarias 🙏 : *"+pregarias+"*\n"+
                        "Horas delante del Santísimo 🕯 : *"+(mediaHoraSantisimo/2)+"*\n"+
                        "Horas de trabajo 💪 : *"+horaTrabajo+"*\n"+
                        "Horas de Estudio o Clase 📖 : *"+(mediaHoraEstudio/2)+"*\n"+
                        "Esfuerzos 🥇 : *"+esfuerzos+"*\n"+
                        "Abstinencias 🚫 : *"+abstinencias+"*\n"+
                        "Actos de fraternidad 🍻: *"+fraternidad+"*\n"+
                        "\nMensajes leidos: *"+mensajesLeidos+"*"

            if(unaPersona) mensajeRespuesta = "Hola _"+quePersona+"_, estos son tus registros:\n\n" + mensajeRespuesta;
            if(!isRecords) msg.reply(mensajeRespuesta);
            else {
                console.log("recordsArray")
                console.log(recordsArray)
                //calculamos quien tiene el mayor numero de cosas
                actualesRecords = [{nom:"---",num:0},{nom:"---",num:0},{nom:"---",num:0},{nom:"---",num:0},{nom:"---",num:0},{nom:"---",num:0},{nom:"---",num:0},{nom:"---",num:0},{nom:"---",num:0}];
                recordsArray.forEach(function (arrayItem) {
                    for(let i = 0; i < arrayItem.data.length; i++){
                        if(actualesRecords[i].num < arrayItem.data[i]){
                            actualesRecords[i].num = arrayItem.data[i]
                            actualesRecords[i].nom = arrayItem.nombre;
                        }
                    }
                });
                console.log("actualesRecords")
                console.log(actualesRecords)

                msg.reply("Records:\n\nMás misas 🍞🍷: _*"+actualesRecords[0].nom+"*_ ➡ *"+actualesRecords[0].num+
                            //" ("+((actualesRecords[0].num*100)/misas).toFixed(2)+"%)"+
                            "*\n"+
                            "Más misterios del rosario 🌹: _*"+actualesRecords[1].nom+"*_ ➡ *"+actualesRecords[1].num+"*\n"+
                            "Más plegarias 🙏: _*"+actualesRecords[2].nom+"*_ ➡ *"+actualesRecords[2].num+"*\n"+
                            "Más horas delante del santísimo 🕯: _*"+actualesRecords[3].nom+"*_ ➡ *"+(actualesRecords[3].num/2)+"*\n"+
                            "Más horas de trabajo 💪: _*"+actualesRecords[4].nom+"*_ ➡ *"+actualesRecords[4].num+"*\n"+
                            "Más horas de estudio 📖: _*"+actualesRecords[5].nom+"*_ ➡ *"+(actualesRecords[5].num/2)+"*\n"+
                            "Más esfuerzos 🥇: _*"+actualesRecords[6].nom+"*_ ➡ *"+actualesRecords[6].num+"*\n"+
                            "Más abstinencias 🚫: _*"+actualesRecords[7].nom+"*_ ➡ *"+actualesRecords[7].num+"*\n"+
                            "Más actos de fraternidad 🍻: _*"+actualesRecords[8].nom+"*_ ➡ *"+actualesRecords[8].num+"*\n"+
                            "\nMensajes leidos: "+mensajesLeidos)
            }

        } else {
            console.log("No se ha encontrado el grupo...");
            msg.reply("ERROR: No se ha encontrado el grupo.")
        }
    } else if (msg.body === "!help" || msg.body === "!effeta" || msg.body === "!ayuda") {
        msg.reply("Escribe !calcula, !calculame, !calculale 34XXXXXXXXX, !records o !info")
    } else if (msg.body === "!info") {
        msg.reply("!calcula: Coge todos los mensajes y recuenta los emoticonos de cada uno.\n\n"+
                    "!calculame: Coge solo los mensajes de la persona que escribe el comando y muestra el recuento de emoticonos de estos.\n\n"+
                    "!calculale: Es obligatorio poner un numero de teléfono separado de un espacio. Coge los mensajes del numero de teléfono que le hayas pedido, y los cuenta.\n\n"+
                    "!records: cuenta los emoticonos de cada persona, y crea una tabla de records con las personas que han introducido más emoticonos.\n\n"+
                    "!help, !effeta, !ayuda: Ayuda general.\n\n"+
                    "!info: Se muestran estos comandos.\n\n"+
                    "!cuantoqueda: dias que quedan para el retiro")
    } else if (msg.body === "!cuantoqueda") {
        const diaActual = new Date();
        const diaDelRetiro = new Date("2023-09-29");
        const diasQueQuedan = (diaDelRetiro.getTime() - diaActual.getTime()) / (1000 * 3600 * 24)
        msg.reply("Quedan *"+diasQueQuedan.toFixed()+"* dias para el retiro.");
    }
});

function calcularXCosas(msg, iteracion){
    //console.log("\t\t\t\tmensaje: "+msg+"\titeracion: "+iteracion);
    if(msg.length > iteracion && (msg.charAt(iteracion) == 'x' || msg.charAt(iteracion) == 'X')) {
        //se multiplica, vamos a ver por cuanto
        //console.log("\t\tparece que hay una X")
        if(!isNaN(msg.charAt(iteracion+1))) {
            if(msg.length > (iteracion+2) && !isNaN(msg.charAt(iteracion+2))) {
                //del 10 al 99
                //console.log("\t\tparece que es del 10 al 99")
                return parseInt(msg.charAt(iteracion+1) + msg.charAt(iteracion+2));
            } else {
                //del 1 al 9
                //console.log("\t\tparece que es del 1 al 9")
                return parseInt(msg.charAt(iteracion+1));
            }
        }
    } else if(msg.length > (iteracion+1) && (msg.charAt(iteracion+1) == 'x' || msg.charAt(iteracion+1) == 'X')) {
        //se multiplica, vamos a ver por cuanto
        //console.log("\t\tparece que hay una X")
        if(!isNaN(msg.charAt(iteracion+2))) {
            if(msg.length > (iteracion+3) && !isNaN(msg.charAt(iteracion+3))) {
                //del 10 al 99
                //console.log("\t\tparece que es del 10 al 99")
                return parseInt(msg.charAt(iteracion+2) + msg.charAt(iteracion+3));
            } else {
                //del 1 al 9
                //console.log("\t\tparece que es del 1 al 9")
                return parseInt(msg.charAt(iteracion+2));
            }
        }
    } else if (msg.length > iteracion && !isNaN(msg.charAt(iteracion))){
        //es un numero, no tiene la x, se pone directamente, pero se calcula si hay mas numeros
        //console.log("\t\tparece que no hay x, pero si numero")
        if(msg.length > (iteracion+1) && !isNaN(msg.charAt(iteracion+1))) {
            //del 10 al 99
            return parseInt(msg.charAt(iteracion) + msg.charAt(iteracion+1));
        } else {
            //del 1 al 9
            return parseInt(msg.charAt(iteracion));
        }
    } else if (msg.length > iteracion && (msg.charAt(iteracion) == ':')) {
        //si hay : no lo cuentes, porque es la descripcion de la cuenta de los mismos emojis!
        return 0;
    }

    return 1;
}

function stringIncludesEmoji (s) {
    return !s.includes('🍞') &&
                !s.includes('🌹') &&
                !s.includes('🙏') && !s.includes('🙏🏻') && !s.includes('🙏🏼') && !s.includes('🙏🏽') && !s.includes('🙏🏾') && !s.includes('🙏🏿') &&
                !s.includes('🕯') &&
                !s.includes('💪') && !s.includes('💪🏻') && !s.includes('💪🏼') && !s.includes('💪🏽') && !s.includes('💪🏾') && !s.includes('💪🏿') &&
                !s.includes('📖') &&
                !s.includes('🎖') && !s.includes('🥇') && !s.includes('🏅') && !s.includes('🥉') && !s.includes('🥈') &&
                !s.includes('🚫') &&
                !s.includes('🍻')

}
