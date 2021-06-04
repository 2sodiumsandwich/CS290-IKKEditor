$(function() {
    /**
     * Toolbar toggles / functions
     */
    $('#adjustment-tool-bar, #paint-tool-bar, #save-modal, #delete-modal, #decoration-tool-bar').draggable();

    $('#paint-toggle').click(() => {
        $('#paint-tool-bar').toggle();
        $('#paint-tool-bar').css('z-index', zindex += 1);
    })

    $('#adjustment-toggle').click(() => {
        $('#adjustment-tool-bar').toggle();
        $('#adjustment-tool-bar').css('z-index', zindex += 1);
    })

    let zindex = 1;

    $('.tool-bar').css('z-index', '0');

    $('.tool-bar').mousedown(function(e) {
        $(this).css('z-index', zindex += 1);
    })

    $('#decoration-toggle').click(() => {
        $('#decoration-tool-bar').toggle();
        $('#decoration-tool-bar').css('z-index', zindex += 1);
        sticker_toggle != sticker_toggle;
        paint = false;
        cropping = false;
        is_erasing = false;
    })

    $("#crop-toggle").click(() => {
        cropping = !cropping;
        paint = false;
        is_erasing = false;
        sticker_toggle = false;
    })

    $('#paint-button').click(() => {
        paint = !paint;
        is_erasing = false;
        cropping = false;
        sticker_toggle = false;
    });

    $('#erase-button').click(() => {
        is_erasing = !is_erasing;
        paint = false;
        cropping = false;
        sticker_toggle = false;
    });

    /**
     * Painting / Erasing UI
     */

    $('#color-picker').on('change', function (e) {
        draw_color = $(this).val(); 
    })

    $('#paint-slider').on('input', function (e) {
        draw_width = e.target.value == 0 ? 1 : e.target.value;
    })

    $('#eraser-slider').on('input', function (e) {
        erase_width = e.target.value;
    })

    $('#save-button, .save-modal-close').click(() => {
        if(active) {
            $('#save-modal').toggle();
        } else {
            alert("Canvas is blank");
        }
    })

    $('.delete-button, .delete-button-close').click(() => {
        if(active) {
            $('#delete-modal').toggle();
        } else {
            alert("Canvas is blank");
        }
    })

    /**
     * Adjustment UI 
     **/    

    $('#brightness-slider').on('input', function (e) {
        brightness = (e.target.value - 50)/50 * 128; //turns 0-100 val into an 8 bit val fo calclatodsnd
        saturation_toggle = false
        if(active) draw();
    })

    $('#contrast-slider').on('input', function (e) {
        contrast = (e.target.value - 50)/50 * 128; // same as abv
        saturation_toggle = false;
        if(active) draw();
    })

    //The change listeners are here for the sake of making draw more streamline, so saturation only applies once per change and doesn't freeze.
    $('#brightness-slider').on('change', function (e) {
    // brightness = (e.target.value - 50)/50 * 128; //turns 0-100 val into an 8 bit val fo calclatodsnd
        saturation_toggle = true
        snapshot();
        if(active) draw();
    })

    $('#contrast-slider').on('change', function (e) {
    //  contrast = (e.target.value - 50)/50 * 128; // same as abv
        saturation_toggle = true;
        snapshot();
        if(active) draw();
    })

    $('#saturation-slider').on('change', function (e) {
        saturation = (e.target.value / 50); //sat is on a scale of 0-2, 1 being default
        saturation_toggle = true;
        if(active) draw();
        snapshot();
    })

    /**
     *  Undo / Redo
     */

    $('#undo').click(() => {
        undo();
    })

    $('#redo').click(() => {
        redo()
    })
})