//para ejecutar el chatbot: node index.js

const qrcode = require('qrcode-terminal');

const { Client } = require('whatsapp-web.js');
const client = new Client();

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
    if (msg.body === '!calcula') {

        let misas = 0;
        let misterios = 0;
        let pregarias = 0;
        let mediaHoraSantisimo = 0;
        let horaTrabajo = 0;
        let mediaHoraEstudio = 0;
        let esfuerzos = 0;
        let abstinencias = 0;

        let chats = await client.getChats();
        let allMsgChats = null;
        for(let j = 0; j < 20; j++){
            if(chats[j].isGroup && chats[j].name == '🙏🏻🙏🏻 FER Unidos en Oración'){
                allMsgChats = await chats[j].fetchMessages({limit: 99999});
                console.log("Se ha encontrado el grupo!");
                break;
            }
        }

        if (allMsgChats != null) {
            console.log("Leyendo mensajes...");
            for(let i = 0; i < allMsgChats.length; i++){
                //console.log("message: "+allMsgChats[i].body)
                let currentmsg = allMsgChats[i].body.replace(/(\n|\r|\s|\t)/gm, "");
                console.log("currentmsg: "+currentmsg+" by "+ (await allMsgChats[i].getContact()).pushname);

                
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
                        console.log("aqui hay "+cantidad+" medias horas de estudio");
                        if(currentmsg.substring(whereIsEmoji+2,currentmsg.length).indexOf('📖') >= 0){
                            submsg = currentmsg.substring(whereIsEmoji+2,currentmsg.length);
                            whereIsEmoji = submsg.indexOf('📖') + whereIsEmoji + 2;
                            continue;
                        }
                        break;
                    }
                }
                if (currentmsg.indexOf('🥇') >= 0) {
                    let whereIsEmoji = currentmsg.indexOf('🥇');
                    while(true){
                        let cantidad = calcularXCosas(currentmsg, whereIsEmoji+2);
                        esfuerzos = esfuerzos + cantidad
                        console.log("aqui hay "+cantidad+" esfuerzos");
                        if(currentmsg.substring(whereIsEmoji+2,currentmsg.length).indexOf('🥇') >= 0){
                            submsg = currentmsg.substring(whereIsEmoji+2,currentmsg.length);
                            whereIsEmoji = submsg.indexOf('🥇') + whereIsEmoji + 2;
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
                        console.log("aqui hay "+cantidad+" abstinencias");
                        if(currentmsg.substring(whereIsEmoji+2,currentmsg.length).indexOf('🚫') >= 0){
                            submsg = currentmsg.substring(whereIsEmoji+2,currentmsg.length);
                            whereIsEmoji = submsg.indexOf('🚫') + whereIsEmoji + 2;
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
            }

            msg.reply("Misas 🍞🍷 : "+misas+"\nMisterios del Rosario 🌹 : "+misterios+"\nPregarias 🙏 : "+pregarias+"\nHoras delante del Santísimo 🕯 : "+(mediaHoraSantisimo/2)+"\nHoras de trabajo 💪 : "+horaTrabajo+"\nHoras de Estudio o Clase 📖 : "+(mediaHoraEstudio/2)+"\nEsfuerzos 🥇 : "+esfuerzos+"\nAbstinencias 🚫 : "+abstinencias);
        } else {
            console.log("No se ha encontrado el grupo...");
        }
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
    }

    return 1;
}
