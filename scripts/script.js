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

    // luodaan formi
    let form = dialog.find("form")
        .on("submit", (event) => {
            event.preventDefault();
            if (validateAddCust(form)) {
                let param = dialog.find("form").serialize();
                addCust(param);
            }
        }
    );

    // tekee post-kutsun palvelimelle ja vastauksen saatuaan jatkaa
    addCust = (param) => {
        $.post("https://codez.savonia.fi/jussi/api/asiakas/lisaa.php", param)
            .then((data) => {
                showAddCustStat(data);
                $('#addCustDialog').dialog("close");
                fetch();
            });
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
        trstr += "</tr>\n";
        $('#data tbody').append(trstr);
    });
}

// poistetaan asiakas
deleteCustomer = (key) => {
    if (isNaN(key)) {
        return;
    }
    $.get({
        url: `https://codez.savonia.fi/jussi/api/asiakas/poista.php?avain=${key}`,
        success: (result) => {
            fetch();
        }
    });
}

toTitleCase = (str) => {
    return str.replace(
        /\w\S*/g,
        function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
}