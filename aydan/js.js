function getPeopleData(claims) {

    // date of birth P569
    var birth_value = getValueData(claims['P569'], 'time');
    var birth_place = getValueQidAndAddLabel(claims['P19']);
    var sortValue = null;

    // date of death P570
    var death_value = getValueData(claims['P570'], 'time');
    var death_place = getValueQidAndAddLabel(claims['P20']);

    // number of spouses P26
    var number_of_spouses = (claims['P26'] && claims['P26'].length) || 0;

    // date of burial or cremation (P4602)
    var date_of_burial = getValueData(claims['P4602'], 'time')

    // place of burial (P119)
    var place_of_burial = getValueQidAndAddLabel(claims['P119']);


    html = "";

    if(birth_value || death_place){
        if(birth_value) {
            html +="*";
            var birth = parseDate(birth_value);
            if(treeType === "descendants" && birth_value) {
                sortValue = birth.dateObject;
            }
            html += birth.output  + ' ';
        }

        if(death_place){
            html += (birth_place ? " {"+birth_place+"}": "");
        }

        html += '<br />'
    }

    if(death_value || death_place) {
        html +="†";
        html += (death_value ? parseDate(death_value).output + " ": "") ;
        html += (death_place ? "{"+death_place+"}": "") ;
        html += '<br />'
    }

    if(date_of_burial || place_of_burial) {
        html +="† Burial: ";
        html += (date_of_burial ?  parseDate(date_of_burial).output + " ": "") ;
        html += (place_of_burial ? "{"+place_of_burial+"}": "") ;
        html += '<br />'
    }

    if(number_of_spouses > 0){
        html +=" ❤ Spouses: "+number_of_spouses+ " <br>" + getSpousesNames(claims['P26']);
    }

    return {
        html: html,
        sortValue: sortValue
    };

}


function getSpousesNames(spouses) {
    var return_html = "";

    for (index = 0; index < spouses.length; ++index) {
        var value = (spouses[index] && spouses[index].mainsnak.datavalue && spouses[index].mainsnak.datavalue.value) || null;
        value = value ? value['numeric-id'] : null;
        value = value ? 'Q' + value : null;

        if(value && labelIds.indexOf(value) === -1) {
            labelIds.push(value);
            return_html += "- {"+value+"}"+"<br>";
        }

    }

    return return_html;
}

