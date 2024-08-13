//para ejecutar el chatbot: node index.js

//dependencia para hotfix de la libreria
//copiar esta linea en package.json -> dependencies {}, por ejemplo debajo de "qrcode-terminal"
//"whatsapp-web.js": "https://github.com/Julzk/whatsapp-web.js/tarball/jkr_hotfix_7"

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

    //punteros
    //las fechas son con formato AÑO-MES-DIA
    //const nombreActualDelGrupo = 'BOMBARDEEMOS EL CIELO ✝️🤍';
    const nombreActualDelGrupo = 'ORACIONS EFFETÁ MARESME 🙏🏻';
    //const nombreActualDelGrupo = 'Bombardegem el Cel Girona';
    //const fechaDesdeDondeSeLee = '2023-09-04';//si está '' significa que coge todos
    const fechaDesdeDondeSeLee = '2024-08-01';
    //const fechaDelRetiro = '2023-09-29';
    const fechaDelRetiro = '2024-09-20';

    if (msg.body === '!calcula' || msg.body === '!calculame' || msg.body === '!records' || msg.body.startsWith('!calculale') || msg.body.startsWith('!calculadesde') || msg.body === '!calcula cat') {

        let misas = 0;
        let misterios = 0;
        let pregarias = 0;
        let mediaHoraSantisimo = 0;
        let horaTrabajo = 0;
        let mediaHoraEstudio = 0;
        let esfuerzos = 0;
        let abstinencias = 0;
        let fraternidad = 0;
        let letanias = 0;
        let mediaHoraAlabanza = 0;

        let chats = await client.getChats();
        let allMsgChats = null;

        const unaPersona = msg.body === '!calculame' || msg.body.includes("!calculale");
        let quePersona;
        try{
            if(unaPersona) quePersona = msg.body === '!calculame' ? (await msg.getContact()).pushname : (await client.getContactById(msg.body.substring(11,22)+'@c.us')).pushname
        } catch (error) {
            msg.reply("ERROR: no se ha podido leer el numero de telefono. Vamos a hacer el recuento para tu propio usuario.");
        }
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

        //console.log("Este es el primer mensaje: "+allMsgChats[0].body)
        //console.log("Intento de fecha: "+ (new Date(allMsgChats[0].timestamp)))
        //console.log("fecha para mensajes: "+ (new Date(fechaDesdeDondeSeLee)))
        //aqui se habla de la issue https://github.com/pedroslopez/whatsapp-web.js/issues/1547

        if (allMsgChats != null) {
            console.log("Leyendo mensajes...");
            for(let i = 0; i < allMsgChats.length; i++){
                //checkeamos fecha del mensaje
                try {
                    if((fechaDesdeDondeSeLee != '' && allMsgChats[i].timestamp < (new Date(fechaDesdeDondeSeLee)) / 1000) || msg.body.startsWith('!calculadesde') && allMsgChats[i].timestamp < (new Date(msg.body.substring(14,24)) / 1000)) continue;
                } catch (error) {
                    msg.reply("ERORR: Fecha introducida incorrecta")
                }

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
                let letaniasMoment = 0;
                let mediaHoraAlabanzaMoment = 0;
                const quePersonaMoment = (await allMsgChats[i].getContact()).pushname

                if(unaPersona && !(quePersona === quePersonaMoment)) continue;

                //console.log("message: "+allMsgChats[i].body)
                let currentmsg = allMsgChats[i].body.replace(/(\n|\r|\s|\t)/gm, "");
                console.log("currentmsg: "+currentmsg+" by "+ (await allMsgChats[i].getContact()).pushname);

                //antes de nada, si el mensaje tiene mucho texto al empezar, descartamos el mensaje
                const ffc = currentmsg.substring(0,7)
                if(stringIncludesEmoji(ffc)) {
                    console.log("descartamos este mensaje, no se han encontrado emojis cercanos")
                    if(i < allMsgChats.length) continue;
                    break;
                }

                //vamos a intentar arreglar la paridad de Blanca Lauci
                //algún iluminado está haciendo lo mismo que Blanca, pero con una X delante...
                if((!isNaN(currentmsg.substring(0,1)) || currentmsg.substring(0,1).toLowerCase === 'x') && stringIncludesEmoji(currentmsg.substring(currentmsg.length-1,currentmsg.length))){
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
                    } else {
                        console.log("aqui hay media misa...")
                        //si llega aqui, ha encontrado el pan, pero no el vino
                        misas++;
                        //esto es un poco inestable... pero cubre algunos fallos humanos (si alguien solo pone el pan, o lo pone invertido (vino y pan en vez de pan y vino), pero lo que pasa es que si a alguien se le escapa un pan, ya cuenta como una misa)
                    }
                }
                
                //prueba para rosas
                ({variable: misterios, varMoment: misteriosMoment} = calculameEsteEmoji(currentmsg, '🌹', 'misterios del rosario', misterios, misteriosMoment));

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

                //prueba para media hora en el santisimo
                ({variable: mediaHoraSantisimo, varMoment: mediaHoraSantisimoMoment} = calculameEsteEmoji(currentmsg, '🕯', 'medias horas al santisimo', mediaHoraSantisimo, mediaHoraSantisimoMoment));
                
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

                //prueba para libros
                ({variable: mediaHoraEstudio, varMoment: mediaHoraEstudioMoment} = calculameEsteEmoji(currentmsg, '📖', 'horas de estudio', mediaHoraEstudio, mediaHoraEstudioMoment));

                //prueba para medallas
                const tiposMedallas = ['🎖','🥇','🏅','🥉','🥈'];
                tiposMedallas.forEach((medalla) => {
                    ({variable: esfuerzos, varMoment: esfuerzosMoment} = calculameEsteEmoji(currentmsg, medalla, 'esfuerzos', esfuerzos, esfuerzosMoment));
                });

                //prueba para abstinencias
                ({variable: abstinencias, varMoment: abstinenciasMoment} = calculameEsteEmoji(currentmsg, '🚫', 'abstinencias', abstinencias, abstinenciasMoment));
                
                //prueba para fraternidad
                ({variable: fraternidad, varMoment: fraternidadMoment} = calculameEsteEmoji(currentmsg, '🍻', 'actos de fraternidad', fraternidad, fraternidadMoment));
                
                //prueba para letanias
                ({variable: letanias, varMoment: letaniasMoment} = calculameEsteEmoji(currentmsg, '😇', 'letanias del rosario', letanias, letaniasMoment));
                
                if (currentmsg.indexOf('🤲') >= 0) {
                    let whereIsEmoji = currentmsg.indexOf('🤲');
                    let cuanGrandeEmoji = 2;
                    while(true){
                        if(currentmsg.indexOf('🤲🏻') >= 0 || currentmsg.indexOf('🤲🏼') >= 0 || currentmsg.indexOf('🤲🏽') >= 0 || currentmsg.indexOf('🤲🏾') >= 0 || currentmsg.indexOf('🤲🏿') >= 0) {
                            cuanGrandeEmoji = 4;
                        } else {
                            cuanGrandeEmoji = 2;
                        }
                        let cantidad = calcularXCosas(currentmsg, parseInt(parseInt(whereIsEmoji) + parseInt(cuanGrandeEmoji)));
                        mediaHoraAlabanza = mediaHoraAlabanza + cantidad
                        mediaHoraAlabanzaMoment = cantidad;
                        console.log("aqui hay "+cantidad+" medias horas de alabanza");
                        if(currentmsg.substring(whereIsEmoji+parseInt(cuanGrandeEmoji),currentmsg.length).indexOf('🤲') >= 0){
                            submsg = currentmsg.substring(whereIsEmoji+parseInt(cuanGrandeEmoji),currentmsg.length);
                            //solo cambiamos la iteracion (de hecho calculamos donde está), para asi no tener que cambiar el string #smart
                            whereIsEmoji = submsg.indexOf('🤲') + whereIsEmoji + parseInt(cuanGrandeEmoji);
                            continue;
                        }
                        break;
                    }       
                }
                

                //después de comprobar todo se deberia hacer un substring para ver si hay emojis repetidos


                // if(allMsgChats[i].body.includes('🍞🍷')) console.log("Una misa");
                // else if(allMsgChats[i].body.includes('🌹')) console.log("Un rosario");
                // else if(allMsgChats[i].body.includes('🙏')) console.log("Una pregaria");
                // else if(allMsgChats[i].body.includes('🕯')) console.log("Media hora delante del santísimo");
                // else if(allMsgChats[i].body.includes('💪')) console.log("Una hora de trabajo");
                // else if(allMsgChats[i].body.includes('📖')) console.log("Media hora de estudio o clase");
                // else if(allMsgChats[i].body.includes('🥇')) console.log("Un esfuerzo");
                // else if(allMsgChats[i].body.includes('🚫')) console.log("Una abstinencia");
                // else if(allMsgChats[i].body.includes('🍻')) console.log("Un acto de fraternidad");
                // else if(allMsgChats[i].body.includes('😇')) console.log("letanias del rosario");
                // else if(allMsgChats[i].body.includes('🤲')) console.log("media hora de alabanza");


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
                            arrayItem.data[9] += letaniasMoment
                            arrayItem.data[10] += mediaHoraAlabanzaMoment
                            arrayItem.mensajesLeidos++

                            seRepiteNombre = true
                            return;
                        }
                    });
                    
                    if (!seRepiteNombre) {
                        recordsArray.push({
                            nombre: quePersonaMoment,
                            data: [misasMoment,misteriosMoment,pregariasMoment,mediaHoraSantisimoMoment,horaTrabajoMoment,mediaHoraEstudioMoment,esfuerzosMoment,abstinenciasMoment,fraternidadMoment,letaniasMoment,mediaHoraAlabanzaMoment],
                            mensajesLeidos: 1
                        });
                    }
                }

                mensajesLeidos++;
            }

            let mensajeRespuesta = "Recuento:\n\nMisas 🍞🍷 : *"+misas+"*\n"+
                        "Misterios del Rosario 🌹 : *"+misterios+"*\n"+
                        "Oraciones 🙏 : *"+pregarias+"*\n"+
                        "Horas delante del Santísimo 🕯 : *"+(mediaHoraSantisimo/2)+"*\n"+
                        "Horas de trabajo 💪 : *"+horaTrabajo+"*\n"+
                        "Horas de Estudio o Clase 📖 : *"+(mediaHoraEstudio/2)+"*\n"+
                        "Esfuerzos 🥇 : *"+esfuerzos+"*\n"+
                        "Abstinencias 🚫 : *"+abstinencias+"*\n"+
                        "Actos de fraternidad 🍻: *"+fraternidad+"*\n"+
                        //"Letanias del rosario 😇: *"+letanias+"*\n"+
                        //"Horas de alabanza 🤲: *"+(mediaHoraAlabanza/2)+"*\n"+
                        "\nMensajes leidos: *"+mensajesLeidos+"*";
            
            if (msg.body === '!calcula cat') {
                mensajeRespuesta = "Recompte:\n\nMisses 🍞🍷 : *"+misas+"*\n"+
                        "Misteris del Rosari 🌹 : *"+misterios+"*\n"+
                        "Pregaries 🙏 : *"+pregarias+"*\n"+
                        "Hores davant del Santíssim 🕯 : *"+(mediaHoraSantisimo/2)+"*\n"+
                        "Hores de feina 💪 : *"+horaTrabajo+"*\n"+
                        "Hores d'Estudi o Classe 📖 : *"+(mediaHoraEstudio/2)+"*\n"+
                        "Esforços 🥇 : *"+esfuerzos+"*\n"+
                        "Abstinències 🚫 : *"+abstinencias+"*\n"+
                        "Actes de Fraternitat 🍻: *"+fraternidad+"*\n"+
                        //"Lletanies del Rosari 😇: *"+letanias+"*\n"+
                        //"Hores de Lloança 🤲: *"+(mediaHoraAlabanza/2)+"*\n"+
                        "\nMissatges llegits : *"+mensajesLeidos+"*"
            }

            if(unaPersona) mensajeRespuesta = "Hola _"+quePersona+"_, estos son tus registros:\n\n" + mensajeRespuesta;
            if(!isRecords) msg.reply(mensajeRespuesta);
            else {
                console.log("recordsArray")
                console.log(recordsArray)
                //calculamos quien tiene el mayor numero de cosas
                actualesRecords = [{nom:"---",num:0},{nom:"---",num:0},{nom:"---",num:0},{nom:"---",num:0},{nom:"---",num:0},{nom:"---",num:0},{nom:"---",num:0},{nom:"---",num:0},{nom:"---",num:0},{nom:"---",num:0},{nom:"---",num:0}];
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
                            "Más pregarias 🙏: _*"+actualesRecords[2].nom+"*_ ➡ *"+actualesRecords[2].num+"*\n"+
                            "Más horas delante del santísimo 🕯: _*"+actualesRecords[3].nom+"*_ ➡ *"+(actualesRecords[3].num/2)+"*\n"+
                            "Más horas de trabajo 💪: _*"+actualesRecords[4].nom+"*_ ➡ *"+actualesRecords[4].num+"*\n"+
                            "Más horas de estudio 📖: _*"+actualesRecords[5].nom+"*_ ➡ *"+(actualesRecords[5].num/2)+"*\n"+
                            "Más esfuerzos 🥇: _*"+actualesRecords[6].nom+"*_ ➡ *"+actualesRecords[6].num+"*\n"+
                            "Más abstinencias 🚫: _*"+actualesRecords[7].nom+"*_ ➡ *"+actualesRecords[7].num+"*\n"+
                            "Más actos de fraternidad 🍻: _*"+actualesRecords[8].nom+"*_ ➡ *"+actualesRecords[8].num+"*\n"+
                            //"Más letanias del rosario 😇: _*"+actualesRecords[9].nom+"*_ ➡ *"+actualesRecords[9].num+"*\n"+
                            //"Más horas de alabanza 🤲: _*"+actualesRecords[10].nom+"*_ ➡ *"+(actualesRecords[10].num/2)+"*\n"+
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
                    "!calculale: Es obligatorio poner un numero de teléfono separado de un espacio (tal que asi '!calculale 34681324967'). Coge los mensajes del numero de teléfono que le hayas pedido, y los cuenta.\n\n"+
                    "!calculadesde: Es obligatorio poner una fecha con formato YYYY-MM-DD (2023-09-15) o MM-DD-YYYY (09-15-2023) separada de un espacio. Coge los mensajes a partir de la fecha introducida.\n\n"+
                    "!records: cuenta los emoticonos de cada persona, y crea una tabla de records con las personas que han introducido más emoticonos.\n\n"+
                    "!help, !effeta, !ayuda: Ayuda general.\n\n"+
                    "!info: Se muestran estos comandos.\n\n"+
                    "!cuantoqueda: dias que quedan para el retiro.\n\n"+
                    "!punteros: De donde se sacan los datos, y desde cuando.\n\n"+
                    "!calcula cat: Torna el càlcul en Català")
    } else if (msg.body === "!cuantoqueda") {
        const diaActual = new Date();
        const diaDelRetiro = new Date(fechaDelRetiro);
        const diasQueQuedan = (diaDelRetiro.getTime() - diaActual.getTime()) / (1000 * 3600 * 24)
        msg.reply("Quedan *"+Math.ceil(diasQueQuedan)+"* dias para el retiro.");
    } else if (msg.body === "!punteros") {
        msg.reply("Punteros:\n\nNombre del grupo que se usa: " + nombreActualDelGrupo + "\n" +
                    "Fecha desde cuando se leen los mensajes: " + new Date(fechaDesdeDondeSeLee).toLocaleDateString('en-CA') + "\n" +
                    "Fecha del retiro: " + new Date(fechaDelRetiro).toLocaleDateString('en-CA'))
    }
});

function calculameEsteEmoji (currentmsg, emoji, nombreEmoji, variable, varMoment) {
    if (currentmsg.indexOf(emoji) >= 0) {
        let whereIsEmoji = currentmsg.indexOf(emoji);
        while(true){
            let cantidad = calcularXCosas(currentmsg, whereIsEmoji+2);
            variable += cantidad
            varMoment = cantidad;
            console.log("aqui hay "+cantidad+" "+nombreEmoji);
            if(currentmsg.substring(whereIsEmoji+2,currentmsg.length).indexOf(emoji) >= 0){
                const submsg = currentmsg.substring(whereIsEmoji+2,currentmsg.length);
                whereIsEmoji = submsg.indexOf(emoji) + whereIsEmoji + 2;
                continue;
            }
            break;
        }
    }

    return {
        variable: variable,
        varMoment: varMoment
    }
}

function calcularXCosas(msg, iteracion){
    //console.log("\t\t\t\tmensaje: "+msg+"\titeracion: "+iteracion);
    if(msg.length > iteracion && (msg.charAt(iteracion) == 'x' || msg.charAt(iteracion) == 'X' || msg.charAt(iteracion) == '*')) {
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
    } else if(msg.length > (iteracion+1) && (msg.charAt(iteracion+1) == 'x' || msg.charAt(iteracion+1) == 'X' || msg.charAt(iteracion+1) == '*')) {
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
                !s.includes('🍻') &&
                !s.includes('😇') &&
                !s.includes('🤲')
}
