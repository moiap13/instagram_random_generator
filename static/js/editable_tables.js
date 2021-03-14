const $tableID_manually = $('#table-manually');
const $tableID_data = $('#table-data');
const $BTN = $('#export-btn');
const $EXPORT = $('#export');
const newTr = `<tr>
  <td class="pt-3-half" contenteditable="true"></td>
  <td class="pt-3-half" contenteditable="true"></td>
  <td class="pt-3-half" contenteditable="true"><input type="checkbox"></td>
</tr>`;
$('.table-add').on('click', 'i', () => {
    $tableID_manually.find('table').append(newTr);
});

$tableID_manually.on('click', '.table-remove', function() {
    $(this).parents('tr').detach();
});

$tableID_manually.on('click', '.table-up', function() {
    const $row = $(this).parents('tr');
    if ($row.index() === 0) {
        return;
    }
    $row.prev().before($row.get(0));
});

$tableID_manually.on('click', '.table-down', function() {
    const $row = $(this).parents('tr');
    $row.next().after($row.get(0));
});

// A few jQuery helpers for exporting only
jQuery.fn.pop = [].pop;
jQuery.fn.shift = [].shift;


$BTN.on('click', () => { // randomize button
    //alert("CLICKED")
    const $rows = $tableID_manually.find('tr:not(:hidden)');
    const headers = [];
    const data = [];
    // Get the headers (add special header logic here)
    $($rows.shift()).find('th:not(:empty)').each(function() {
        headers.push($(this).text().toLowerCase());
    });

    // Turn all existing rows into a loopable array
    $rows.each(function() {
        const $td = $(this).find('td');
        const h = {}; // Use the headers from earlier to name our hash keys
        headers.forEach((header, i) => {
            if(i===2)
                h[header] = $td.eq(i)[0].children[0].checked
            else
                h[header] = $td.eq(i).text();
        });
        data.push(h);
    });

    data_stringify = JSON.stringify(data);
    console.log(data_stringify);
    $("#txt_area_json").append(data_stringify);
    //$('#json_randomize_data').val(data_stringify);
    //$('#input_randomize').val(data_stringify);

    $('#form_randomize').trigger('submit');

    // Output the result
    //$EXPORT.text(JSON.stringify(data));
});



/*


$("#export-btn-data").click(function () {
    const $rows = $tableID_data.find('tr:not(:hidden)');
    const headers = [];
    const data = [];
    // Get the headers (add special header logic here)
    $($rows.shift()).find('th:not(:empty)').each(function() {
        headers.push($(this).text().toLowerCase());
    });

    // Turn all existing rows into a loopable array
    $rows.each(function() {
        const $td = $(this).find('td');
        const h = {}; // Use the headers from earlier to name our hash keys
        headers.forEach((header, i) => {
            if(i===2)
                h[header] = $td.eq(i)[0].children[0].checked
            else
                h[header] = $td.eq(i).text();
        });
        data.push(h);
    }); // Output the result
    $("#export-data").text(JSON.stringify(data));
});


 */
function showFinalData(data) {
    $('.tr_gen_automatically').remove();
    var cummul_comments = 0
    if(data != null){
        data.forEach((data_row, i) => {
            var checked = (data_row["story"]?"checked":"");
            cummul_comments += data_row["comments"];
            var data_tr = '<tr class="tr_gen_automatically">\
              <td class="pt-3-half" contenteditable="false">'+data_row["username"]+'</td>\
              <td class="pt-3-half" contenteditable="false">'+data_row["comments"]+'</td>\
              <td class="pt-3-half" contenteditable="false"><input onClick="addStory(this)" type="checkbox" '+ checked +' ></td>\
            </tr>';
            $tableID_manually.find('table').append(data_tr);
        });
    }
}

function addStory(e) {
    console.log(e);
}