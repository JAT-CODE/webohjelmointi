$().ready (() => {
    let astys = {};

    // haetaan asiakastyypit
    $.get({
        url: "http://localhost:3002/Asiakas",
        success: (result) => {
            astys = result;
            result.forEach((r) => {
                let optstr = `<option value="${r.avain}">${r.lyhenne + " " + toTitleCase(r.selite)}</option>`;
                $('#custType').append(optstr);
                $('#custCustType').append(optstr);
            });
        }
    });


    // haetaan data
    fetch = () => {
        let sp = searcParameters();
        $.get({
            url: `http://localhost:3002/Asiakas?${sp}`,
            success: (result) => {
                showResultInTable(result, astys);
        }});
    }

    // bindataan click-event
    $('#searchBtn').click(() => {
        fetch();
    });

    // otetaan kaikki asiakaanlisäysformin elementit yhteen muuttujaan
    let allFields = $([])
        .add($('#custName'))
        .add($('#custAddress'))
        .add($('#custPostNbr'))
        .add($('#custPostOff'))
        .add($('#custCustType'));

    // luodaan asiakkaanlisäysdialogi
    let dialog = $('#addCustDialog').dialog({
        autoOpen: false,
        modal: true,
        resizable: false,
        minWidth: 400,
        width: 'auto',
        close: function() {
            form[0].reset();
            allFields.removeClass("ui-state-error");
        }
    });

    // luodaan asiakkaanmuokkausdialogi
    let modDialog = $('#modCustDialog').dialog({
        autoOpen: false,
        modal: true,
        resizable: false,
        minWidth: 400,
        width: 'auto',
        close: function () {
            form[0].reset();
            allFields.removeClass("ui-state-error");
        }
    });

    // luodaan formi lisäykseen
    let form = dialog.find("form")
        .on("submit", (event) => {
            event.preventDefault();
            //if (validateAddCust(form)) { //poistetaan kenttien tarkistus kommentoimalla tämä
                let param = dialog.find("form").serialize();
                addCust(param);
            //} // ja tämä
        }
    );

    
    // luodaan formi muokkaukseen
    let modForm = modDialog.find("form")
        .on("submit", (event) => {
            event.preventDefault();
            let param = modDialog.find("form").serialize();
            let avainT = $('#avain').val();
            modifyCustomer(param, avainT);
        }
    );

    // tekee post-kutsun palvelimelle ja vastauksen saatuaan jatkaa
    //kutsuu addcust validointia tarkistaakseen onko parametrikentät täytetty
    addCust = (param) => {
        if (!validateAddCust(form)) {
          console.log("Jokin parametri puuttuu");
          $('#warning').show();
        } else {
        $.post("http://localhost:3002/Asiakas", param)
            .then((data) => {
                showAddCustStat(data);
                console.log("logtest")
                fetch();
                $('#addCustDialog').dialog("close");
            });
        }
    }

    // näyttää lisäyksen onnistumisen tai epäonnistumisen
    showAddCustStat = (data) => {
        if (data.status == 'ok') {
            $('#addStatus').css("color", "green").text("Asiakkaan lisääminen onnistui")
            .show().fadeOut(6000);
        } else {
            $('#addStatus').css("color", "red").text("Lisäämisessä tapahtui virhe: " + data.status_text).show();
        }
    }

    // avataan asiakkaanlisäysdialogi jos sitä ei ole jo avattu
    $('#addCustBtn').click(() => {
        const isOpen = $('#addCustDialog').dialog("isOpen");
        if (!isOpen) {
            $('#addCustDialog').dialog("open");
        }
    });
});

// tarkistaa onko dialogin kentät täytetty ja näyttää varoitukset jos ei
validateAddCust = (form) => {
    let inputs = form.find('input');
    let valid = true;
    for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].value == '') {
            inputs[i].classList.toggle("ui-state-error", true);
            valid = false;
        } else {
            inputs[i].classList.toggle("ui-state-error", false);
        }
    }
    if (form.find('select')[0].value === 'empty') {
        form.find('select')[0].classList.toggle("ui-state-error", true);
        valid = false;
    } else {
        form.find('select')[0].classList.toggle("ui-state-error", false);
    }
    if (valid) {
        $('#warning').hide();
        return true;
    }
    $('#warning').show();
    return false;
}

// palauttaa hakuparametri-stringin jos kentät eivät ole tyhjiä
searcParameters = () => {
    let str = '';
    if ($('#name').val().trim() != '') {
        let name = $('#name').val().trim();
        str += `nimi=${name}`;
    }
    if ($('#address').val().trim() != '') {
        let address = $('#address').val().trim();
        if (str !== '') {
            str += '&';
        }
        str += `osoite=${address}`;
    }
    if ($('#custType').val() !== null) {
        let custType = $('#custType').val();
        if (str !== '') {
            str += '&';
        }
        str+=`asty_avain=${custType}`;
    }
    return str;
}

// tyhjentää data-tablen ja tuo haun tuloksen tableen
showResultInTable = (result, astys) => {
    $('#data tbody').empty();
    result.forEach(element => {
        let trstr = "<tr><td>" + element.NIMI + "</td>\n";
        trstr += "<td>" + element.OSOITE + "</td>\n";
        trstr += "<td>" + element.POSTINRO + "</td>\n";
        trstr += "<td>" + element.POSTITMP + "</td>\n";
        trstr += "<td>" + element.LUONTIPVM + "</td>\n";
        trstr += "<td>" + element.ASTY_AVAIN + "</td>\n";
        trstr += '<td><button type="button" value="Poista" onclick="deleteCustomer('+element.AVAIN+')">Poista</button></td>\n';
        trstr += '<td><button type="button" value="Muuta" id="Muuta" onclick="modClick('+element.AVAIN+')">Muuta</button></td>\n';
        $('#data tbody').append(trstr);
    });
}



function modClick(avain) {
    const isOpen = $('#modCustDialog').dialog("isOpen");
    if (!isOpen) {
        $('#modCustDialog').dialog("open");
    }
    $.ajax({
        url: `http://localhost:3002/Asiakas/${avain}`,
        type: 'GET',
        success: (result) => {
            result.forEach((element) => {
                $("#avain").val(avain);
                $("#mnimi").val(element.NIMI);
                $("#mosoite").val(element.OSOITE);
                $("#mpostinro").val(element.POSTINRO);
                $("#mpostitmp").val(element.POSTITMP);
                $("#masty_avain").val(element.ASTY_AVAIN);
            })
            console.log("success");

        }
    });
}

// poistetaan asiakas
deleteCustomer = (key) => {
    console.log(key);
    if (isNaN(key)) {
        return;
    }
    console.log("Poistettu");
    //html delete 
    $.ajax({
        url: `http://localhost:3002/Asiakas/${key}`,
        type: 'DELETE',
        success: (result) => {
            fetch();
        }
    });
}

// muutetaan asiakkaan tietoja

modifyCustomer = (param, avain) => {
    console.log("testingmod")
    console.log(JSON.stringify(param));
    $.ajax({
        url: `http://localhost:3002/Asiakas/${avain}`,
        type: 'PUT',
        data: {
            id: avain,
            nimi: $('#mnimi').val(),
            osoite: $('#mosoite').val(),
            postinro: $('#mpostinro').val(),
            postitmp: $('#mpostitmp').val(),
            asty_avain: $('#masty_avain').val()
        },
        success: function(result) {
            console.log(result);
            $('#modCustDialog').dialog("close");
            fetch();
        }
    })
}


toTitleCase = (str) => {
    return str.replace(
        /\w\S*/g,
        function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
}
haeTyypit();
function haeTyypit() {
    $.get(
        {
            url: 'http://localhost:3002/Tyypit',
            success: (result) => {
                result.forEach(element => {
                    var optionString = "<option value='" + element.Avain + "'>" + element.Lyhenne + " - " + element.Selite + "</option>"
                    $(".custType").append(optionString);
                })
            }
        }
    )
}