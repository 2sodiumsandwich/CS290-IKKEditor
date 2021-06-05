$(function() {
    /**
     * Toolbar toggles / functions
     */
    //Making tool bars draggable.
    $('#adjustment-tool-bar, #paint-tool-bar, #save-modal, #delete-modal, #decoration-tool-bar').draggable();

    $('#paint-toggle').click(() => {
        if(!active) {
            $('.error-prompt').show();
        } else {
            $('#paint-tool-bar').toggle();
            $('#paint-tool-bar').css('z-index', zindex += 1);
        }
    })

    $('#adjustment-toggle').click(() => {
        if(!active) {
            $('.error-prompt').show();
        } else {
            $('#adjustment-tool-bar').toggle();
            $('#adjustment-tool-bar').css('z-index', zindex += 1);
        }
    })

    //Moving active tool bars to the front
    let zindex = 1;

    $('.tool-bar').css('z-index', '0');
    $('.tool-bar').mousedown(function(e) {
        $(this).css('z-index', zindex += 1);
    })

    $('#decoration-toggle').click(() => {
        if(!active) {
            $('.error-prompt').show();
        } else {
            $('#decoration-tool-bar').toggle();
            $('#decoration-tool-bar').css('z-index', zindex += 1);
            sticker_toggle != sticker_toggle;
            paint = false;
            cropping = false;
            is_erasing = false;
        }
    })

    $("#crop-toggle").click(() => {
        if(!active) {
            $('.error-prompt').show();
        } else {
            cropping = !cropping;
            paint = false;
            is_erasing = false;
            sticker_toggle = false;
        }
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

    //if brush size = 0, things break
    $('#paint-slider').on('input', function (e) {
        draw_width = e.target.value == 0 ? 1 : e.target.value;
    })

    $('#eraser-slider').on('input', function (e) {
        erase_width = e.target.value == 0 ? 1 : e.target.value;
    })

    $('#save-button, .save-modal-close').click(() => {
        if(!active) {
            $('.error-prompt').show();
        } else {
            $('#save-modal').toggle();
        }
    })

    $('.delete-button, .delete-button-close').click(() => {
        if(!active) {
            $('.error-prompt').show();
        } else {
            $('#delete-modal').toggle();
        } 
    })

    /**
     * Adjustment UI 
     **/    

    $('#brightness-slider').on('input', function (e) {
        brightness = (e.target.value - 50)/50 * 128; //turns 0-100 val into an 8 bit value for calculations
        saturation_toggle = false
        if(active) draw();
    })

    $('#contrast-slider').on('input', function (e) {
        contrast = (e.target.value - 50)/50 * 128; // same as above
        saturation_toggle = false;
        if(active) draw();
    })

    //The change listeners are here for the sake of making draw more streamline, so saturation only applies once per change and doesn't freeze.
    //snapshot() is for undo / redo
    $('#brightness-slider').on('change', function (e) {
        saturation_toggle = true
        if(active) draw();
        snapshot();
    })

    $('#contrast-slider').on('change', function (e) {
        saturation_toggle = true;
        if(active) draw();
        snapshot();
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

    /**
     *  Error prompt
     */

    $('#error-accept').click(() => {
        $('.error-prompt').toggle();
    })

    $('#success-accept').click(() => {
        $('.success-prompt').toggle();
    })
})