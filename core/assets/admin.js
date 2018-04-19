/**
 * Admin JS file
 *
 * This file contains global admin functions
 *
 * @package Layers
 * @since Layers 1.0.0
 *
 * Contents
 * 1 - Layers Custom Easing
 * 2 - Media Uploaders
 * 2.a - Image Remove Button
 * 2.b - Image Upload Button
 * 2.c - General File Remove Button
 * 2.d - General File Upload Button
 * 3 -Background Selectors
 * 4 - Color Selectors
 * 5 - Sortable Columns
 * 6 - Tabs
 * 7 - Design Controller toggles
 * 8 - Show/Hide linked elements
 * 9 - Design-Bar Accordions
 * 9.a - Accordion Click
 * 9.b - Accordion Init
 * 10 - Control Accordions
 * 10.a - Accordion Init
 * 11 - Design-Bar Tabs
 * 11.a - Tabs Click
 * 11.b - Tabs Init
 * 12 - Control Tabs
 * 12.a - Tabs Init
 * 13 - Paint special styles onto the Groups and Accordions.
 * 14 - Widget Focussing
 * 15 - Trigger input changes
 * 16 - Add Last Class to Design-Bar Elements
 * 17 - Init RTE Editors
 * 18 - Custom Widget Initialization Events
 * 19 - Intercom checkbox
 * 20 - Widget Peek/hide to preview changes
 * 21 - Customizer Control - Range Slider
 * 22 - Reset to Default
 * 23 - Linking from one section/panel to another.
 * 24 - Init Tip-Tip
 * 25 - Linking-UX
 * 26 - Force Customizer refresh if Widget exists that's not partial-widget-refresh.
 *
 * Author: Obox Themes
 * Author URI: http://www.oboxthemes.com/
 * License: GNU General Public License v2 or later
 * License URI: http://www.gnu.org/licenses/gpl-2.0.html
 */

jQuery(function($) {

	/**
	 * 1 - Layers Custom Easing
	 *
	 * Extend jQuery easing with custom Layers easing function for UI animations - eg slideUp, slideDown
	 */

	// easeInOutQuad
	/*jQuery.extend( jQuery.easing, { layersEaseInOut: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t + b;
		return -c/2 * ((--t)*(t-2) - 1) + b;
	}});*/

	// easeInOutQuint
    jQuery.extend( jQuery.easing, { layersEaseInOut: function (x, t, b, c, d) {
        if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
        return c/2*((t-=2)*t*t*t*t + 2) + b;
    }});

	/**
	 * 2 - Media Uploaders
	 */

	// 2.a - Image Remove Button
	var file_frame;
	$(document).on( 'click', '.layers-image-container .layers-image-remove', function(e){
		e.preventDefault();

		// "Hi Mom"
		$that = $(this);

		// Get the container
		$container = $that.closest( '.layers-image-container' );

		$that.siblings('img').remove();
		$container.removeClass( 'layers-has-image' );

		$container.find('input').val('').layers_trigger_change();
		$that.fadeOut();
		return false;
	});

	// 2.b - Image Upload Button
	$(document).on( 'click', '.layers-image-upload-button', function(e){
		e.preventDefault();

		// "Hi Mom"
		$that = $(this);

		// Get the container
		$container = $that.closest( '.layers-image-container' );

		// If the media frame already exists, reopen it.
		if ( file_frame ) {
			file_frame.close();
		}

		// Create the media frame.
		file_frame = wp.media.frames.file_frame = wp.media({
			title: $that.data( 'title' ),
			button: {
				text: $that.data( 'button_text' ),
			},
			multiple: false  // Set to true to allow multiple files to be selected
		});

		// When an image is selected, run a callback.
		file_frame.on( 'select', function() {
			// We set multiple to false so only get one image from the uploader
			attachment = file_frame.state().get('selection').first().toJSON();

			$container.find('img video').remove();

			// Fade in Remove button
            // Remove any old image

			// Also trigger click event on image-remove to go by the flow of
			// previously selected image removal
            $container.find('.layers-image-remove').trigger('click');
			$container.find('.layers-image-remove').fadeIn();

			// Set attachment to the large/medium size if they're defined
			if( 'image' == attachment.type ) {

				if ( undefined !== attachment.sizes.medium )  {
					$attachment = attachment.sizes.medium;
				} else if( undefined !== attachment.sizes.large ) {
					$attachment = attachment.sizes.large;
				} else {
					$attachment = attachment;
				}

				// Create new image object
				var $image = $('<img />').attr({
					class  : 'image-reveal',
					src    :  $attachment.url,
					height :  $attachment.height,
					width  : $attachment.width
				});

			} else{

				// Create new image object
				var $image = $('<img />').attr({
					class  : 'image-reveal',
					src    :  attachment.icon
				});

			}

			$container.children('.layers-image-display').eq(0).append( $image );

			// Add 'Has Image' Class
			$container.addClass( 'layers-has-image' );

			// Trigger change event
			$container.find('input').val( attachment.id ).layers_trigger_change();

			return;
		});

		// Finally, open the modal
		file_frame.open();
	});

	// 2.c - General File Remove Button
	$(document).on( 'click', '.layers-file-remove', function(e){
		e.preventDefault();

		// "Hi Mom"
		$that = $(this);

		$that.siblings('span').text('');
		$that.siblings('input').val('').layers_trigger_change();
		$that.closest( '.layers-file-container' ).removeClass( 'layers-has-file' );

		$that.fadeOut();
		return false;
	});

	// 2.d - General File Upload Button
	$(document).on( 'click', '.layers-regular-uploader', function(e){
		e.preventDefault();

		// "Hi Mom"
		$that = $(this);

		// If the media frame already exists, reopen it.
		if ( file_frame ) {
			file_frame.close();
		}

		// Create the media frame.
		file_frame = wp.media.frames.file_frame = wp.media({
			title: $that.data( 'title' ),
			button: {
				text: $that.data( 'button_text' ),
			},
			multiple: false  // Set to true to allow multiple files to be selected
		});

		// When an image is selected, run a callback.
		file_frame.on( 'select', function() {
			// We set multiple to false so only get one image from the uploader
			attachment = file_frame.state().get('selection').first().toJSON();

			$that.closest( '.layers-file-container' ).addClass( 'layers-has-file' );

			// Fade in Remove button
			$that.siblings('small').fadeIn();

			// Add file name to the <span>
			$that.siblings('span').text( attachment.filename );

			// Trigger change event
			$that.siblings('input').val( attachment.id ).layers_trigger_change();

			return;
		});

		// Finally, open the modal
		file_frame.open();
	});

	/**
	 * 3 -Background Selectors
	 */

	$(document).on( 'click', '.layers-background-selector li', function(e){
		e.preventDefault();

		// "Hi Mom"
		$that = $(this);

		$type = $that.data('type');
		$id = $that.data('id');
		$index = $that.index();

		// Our main containing div, we could use .parent() but what if we change the depth of this li?
		$elements = $( $id + '-controller' ).find( '.layers-controller-elements' );

		// Change the input value
		$( $id + '-type' ).val( $type ).layers_trigger_change();

		// Switch the selectors
		$that.addClass( 'active' );
		$that.siblings().removeClass( 'active' );

		// Switch the view
		$elements.find( '.layers-content' ).eq( $index ).addClass('section-active');
		$elements.find( '.layers-content' ).eq( $index ).siblings().removeClass('section-active');
	});

	/**
	 * 4 - Color Selectors
	 */

	if ( $('body.wp-customizer').length ) {

		/**
		 * Customizer
		 */

		$( document ).on( 'layers-interface-init', function( e, element ){
			layers_set_color_selector( $(element) );
		});
	}
	else{

		/**
		 * Not Customizer
		 */

		layers_set_color_selector( $('body') );
	}

	function layers_set_color_selector( $element ){

		$element.find('.layers-color-selector').each( function( index, element ) {

			var $color_input = $(this);

			// Initialize the individual color-picker
			$color_input.wpColorPicker({
				change: function(event, ui){
					if( 'undefined' !== typeof event ){

						// Update the color input
						$( event.target ).val( ui.color.toString() );

						// Debounce the color changes
						layers_debounce_color_input( $( event.target ) );
					}
				},
				clear: function(event) {
					if( 'undefined' !== typeof event && 'click' === event.type ){

						// Ping a change to the main input - the value will be ''.
						$( $color_input ).layers_trigger_change();
					}
				},
				palettes: [ '#000000', '#FFFFFF', '#E2594E', '#F39C12', '#FFCD03', '#A2C661', '#009EEC', '#934F8C' ],
			});

		});
	}

	// Debounce function for color changing.
	var layers_debounce_color_input = _.debounce( function( element ){
		$( element ).layers_trigger_change();
	}, 400, false );
	
	// Enable clicking of the Label or Description to envoke the color picker (Design-Bar)
	$(document).on( 'click', '.layers-color-wrapper > label', function(){
		var $holder = $(this).parents('.layers-color-wrapper');
		$holder.find('a.wp-color-result, button.wp-color-result').click();
	});
	
	// Enable clicking of the Label or Description to envoke the color picker (Controls)
	$(document).on( 'click', '.l_option-customize-control-color > label, .l_option-customize-control-color > .customize-control-description', function(){
		var $holder = $(this).parents('.l_option-customize-control-color ');
		$holder.find('a.wp-color-result, button.wp-color-result').click();
	});

	/**
	 * 5 - Sortable Columns
	 */

	$( document ).on( 'layers-interface-init', function( e, element ){
		layers_init_sortable_columns( $(element) );
	});

	function layers_init_sortable_columns( $element_s ){

		// Bail if no sortable
		if( $.sortable == undefined ) return;

		$($element_s).find( '.layers-sortable').sortable({
			placeholder: "layers-sortable-drop"
		});
	}

	/**
	 * 6 - Tabs
	 */

	$( document ).on( 'click', '.l_admin-tabs li, .l_admin-tabs li a', function(e){

		e.preventDefault();

		// "Hi Mom"
		$that = $(this);

		// Get the Tab Index
		$i = $that.index();

		// Make this tab active
		$that.addClass( 'active' ).siblings().removeClass( 'active' );

		// Get the nearest tab containers
		$tab_nav = $that.closest( '.l_admin-nav-tabs' );
		$tab_container = $tab_nav.siblings('.l_admin-tab-content');

		// Show/Hide tabs
		$tab_container.find( 'section.l_admin-tab-content' ).eq( $i ).addClass('l_admin-show').removeClass('l_admin-hide').slideDown().siblings( 'section.l_admin-tab-content' ).addClass('l_admin-hide').removeClass('l_admin-show').slideUp();
	});

	/**
	 * 7 - Design Controller toggles
	 */

	// WIDGET - Design-Bar Flyout Menus e.g. Layout, List Style, Advanced.
	var $menu_is_open = false;

	// Close any previously opened menu's.
	$( document ).on( 'click', function(e) {

		// Only ever do this if there is a previously opened item
		// is less taxing than searching the entire Customizer DOM
		// for open items every click in the customizer.
		if ( $menu_is_open ) {

			var $opened = $('.widget .layers-visuals-item.layers-active' ).not( $(e.target).parents('li.layers-visuals-item') );

			if ( $opened.length ) {

				$opened.removeClass( 'layers-active' );
				$menu_is_open = false;
			}
		}
	});
	
	// Open the clicked menu.
	$( document ).on( 'click', '.widget ul.layers-visuals-wrapper > li.layers-visuals-item > a.layers-icon-wrapper', function(e){

		e.preventDefault();

		// "Hi Mom"
		$that = $(this);

		// Cache container element
		$li_container = $that.parent( 'li.layers-visuals-item' );

		// Close Siblings
		$li_container.toggleClass( 'layers-active' );

		$li_container.siblings().not( $that.parent() ).removeClass( 'layers-active' );

		$group_element = $li_container.find( '.layers-design-bar-group' ).eq(0);

		if( !$group_element.hasClass( 'layers-design-bar-group-open' ) )
			$group_element.find( '.layers-group-start-wrapper' ).trigger( 'click' );
		

		// Toggle active state
		$that.trigger( 'layers-design-bar-menu', $that ); // Deprecated event.

		$menu_is_open = ( $that.parent( 'li.layers-visuals-item' ).hasClass('layers-active') );
	});

	// WIDGET - Select Icon Group e.g. Text Align (left, right, center, justify).x
	$( document ).on( 'mousedown', '.layers-select-icons label.layers-icon-wrapper', function(e){
		
		// Cache elements.
		var $current_label = $(this);
		var $current_input = $('#' + $current_label.attr('for'));
		var $sibling_labels = $current_label.siblings( '.layers-icon-wrapper' );

		// Get input value
		var $value = $current_input.val();

		// When the the whole flyout-menu is one Select Icon Group e.g. a widget's Layout (Boxed, Full-Width)
		// then set the parents Icon to what is being selected now - helpful to the user, it can be seen at a glance.
		$is_form_item = $current_label.closest( '.layers-form-item' ).siblings( '.layers-form-item' ).length;

		$in_design_group = ( 0 == $current_label.closest( '.layers-design-bar-group-inner' ).length );

		if ( 0 == $is_form_item && $in_design_group ) {

			$current_label
				.closest( '.layers-pop-menu-wrapper' )
				.siblings( '.layers-icon-wrapper' )
				.find( 'span[class^="icon-"]' )
				.attr( 'class', 'icon-' + $value );
		}

		// Toggle active state
		$current_label.trigger( 'layers-design-bar-menu', $current_label );

		
		if ( 'checkbox' == $current_input.attr('type') ) {
			
			// Input is a 'checkbox' when there's only one single button - so make it toggle on/off.

			if ( $current_label.hasClass( 'layers-active' ) ) {
				// Activate current.
				$current_label.removeClass( 'layers-active' );
			}
			else {
				// De-activate siblings.
				$current_label.addClass( 'layers-active' );
			}
		}
		else {
			
			// Input is a 'radio' when there's multiple buttons - so make them behave like radio.
			
			// Activate current.
			$current_label.addClass( 'layers-active' );
			
			// De-activate siblings.
			$sibling_labels.removeClass( 'layers-active' );
		}
	});

	// CUSTOMIZE CONTROLS - Select Icon Group e.g. Header Width (Boxed, Full-Width)
	$( document ).on( 'click', '[id^="layers-customize"] .layers-visuals-item input', function(e){

		e.stopPropagation();
		
		// Cache elements.
		var $current_input = $(this);
		var $current_li = $current_input.parents('.layers-visuals-item');
		var $current_label = $current_li.find('label');
		var $sibling_elements = $current_li.siblings( '.layers-visuals-item' );

		if (
				1 < $sibling_elements.length &&
				$sibling_elements.eq(0).find('input').prop('name') !== $current_li.find('input').prop('name')
			) {
			
			/**
			 * Multi-Select.
			 */

			if ( $current_li.hasClass( 'layers-active' ) ) {
				$current_li.removeClass( 'layers-active' );
				// $current_input.prop( 'checked', false );
			}
			else {
				$current_li.addClass( 'layers-active' );
				// $current_input.prop( 'checked', true );
			}
		}
		else {
			
			/**
			 * Single Select.
			 */

			// Uncheck all siblings.
			$sibling_elements.removeClass( 'layers-active' );

			// Check the current selected element.
			// $current_li.trigger( 'layers-design-bar-menu', $current_li );
			$current_li.addClass( 'layers-active' );
		}
	});

	$( document ).on( 'layers-design-bar-menu', '.layers-visuals-item', function( e, menu_item ){
		$img = $(this).find( 'img[data-src]' );

		$img.each(function(){
			$(this).attr( 'src', $(this).data( 'src' ) );
		});
	});

	// Set the correct element as checked on init - for elements that are added after page load.
	// eg javascript added elements like the repeater items.
	$( document ).on( 'layers-interface-init', function( e, element ){

		$(element).find( '.layers-icon-group').each( function( j, element ) {

			$select_group = $(element);
			$select_item = $select_group.find('input[checked]');
			$select_item_label = $select_item.parents('label');

			$select_group.find('.layers-active').removeClass('layers-active');

			$select_item_label.trigger('mousedown');
			$select_item_label.addClass('layers-active');
		});
	});
	
	/**
	 * 8 - Show/Hide linked elements
	 */
	
	var $show_if_animation_duration = 550;

	if ( $('body.wp-customizer').length ) {

		/**
		 * Customizer
		 */

		$( document ).on( 'layers-interface-init', function( e, element ){
			
			$show_if_animation_duration = 0;
			
			layers_init_show_if( $(element) );
			
			$show_if_animation_duration = 550;
		});
	}
	else {

		/**
		 * Not Customizer
		 */

		layers_init_show_if( $('body') );
	}

	function layers_init_show_if( $element_s ){

		var $has_control_groups = ( 0 !== $element_s.find('.l_option-customize-control.group').length );
		var $single_set_timeout;
		
		$element_s.find( '[data-show-if-selector]').each( function( j, element ) {

			var $this_element    = $(element);
			var $compare_element = $( $this_element.attr( 'data-show-if-selector' ) );

			// Apply show-if to the element once on startup.
			layers_apply_show_if( $this_element, $compare_element );
			
			if ( $has_control_groups ) {
				clearTimeout( $single_set_timeout );
				$single_set_timeout = setTimeout(function() {
					layers_repaint_control_classes( $element_s );
				}, $show_if_animation_duration );
			}

			// Apply show-if to the element when this element is changed.
			$( $compare_element ).on( 'change', function(e){
				
				layers_apply_show_if( $this_element, $compare_element );
				
				if ( $has_control_groups ) {
					clearTimeout( $single_set_timeout );
					$single_set_timeout = setTimeout(function() {
						layers_repaint_control_classes( $element_s );
					}, $show_if_animation_duration );
				}
			});
		});
	}

	function layers_apply_show_if( $this_element, $compare_element ){

		var $this_element_value = $this_element.data( 'show-if-value' ).toString().split(',');
		var $operator           = $this_element.data( 'show-if-operator' );

		// Get value based on the type of input being used.
		if ( $compare_element.attr('type') == 'checkbox' ) {
			
			// Checkbox
			$compare_element_value = ( $compare_element.is(':checked') ) ? 'true' : 'false' ;
		}
		else if ( 0 < $compare_element.closest( '.layers-select-icons' ).length && 0 < $compare_element.closest( 'fieldset.layers-post-meta' ).length ) {

			// Select icons
			$compare_element_value = $compare_element.parent().find('input:checked').val();
		}
		else if ( $compare_element.hasClass( 'customize-control customize-control-layers-select-icons' ) ) {

			// Select icons
			$compare_element_value = $compare_element.find('input:checked').val();
		}
		else {
			
			// All other inputs
			$compare_element_value = $compare_element.val();
		}

		// Bail if there's no source element to reference.
		if ( 'undefined' === typeof( $compare_element_value ) || null === $compare_element_value ) {
			layers_show_if_display( 'hide', $this_element );
			return false;
		}

		var $action = 'hide';

		// Compare based on the chosen operator (default: ==)
		switch( $operator ) {

			case '!=':

				$.each( $this_element_value, function( index, val ) {
					if ( val.trim() != $compare_element_value.trim() )
						$action = 'show';
				});

				break;

			case '!==':

				$.each( $this_element_value, function( index, val ) {
					if ( val.trim() !== $compare_element_value.trim() )
						$action = 'show';
				});

				break;

			case '>':

				$.each( $this_element_value, function( index, val ) {
					if ( val.trim() > $compare_element_value.trim() )
						$action = 'show';
				});

				break;

			case '<':

				$.each( $this_element_value, function( index, val ) {
					if ( val.trim() < $compare_element_value.trim() )
						$action = 'show';
				});

				break;

			case '>=':

				$.each( $this_element_value, function( index, val ) {
					if ( val.trim() >= $compare_element_value.trim() )
						$action = 'show';
				});

				break;

			case '<=':

				$.each( $this_element_value, function( index, val ) {
					if ( val.trim() <= $compare_element_value.trim() )
						$action = 'show';
				});

				break;

			case '==':
			default:

				$.each( $this_element_value, function( index, val ) {
					if ( val.trim() == $compare_element_value.trim() )
						$action = 'show';
				});

				break;
		}

		// Apply the result of the above compare.
		layers_show_if_display( $action, $this_element );
	}

	function layers_show_if_display( $action, $element ) {

		// Calculate the reveal animation type.
		var animation_type = 'none';

		// Get the right target element depending on what kind of component this is (is Customize Control or Design-Bar item)
		if ( $element.hasClass('l_option-customize-control') ){

			// Target element is - Customize Control (entire control)
			$element = $element.parent('.customize-control');
			animation_type = 'slide';
		}
		else if ( $element.hasClass('layers-design-bar-form-item') ) {

			// Target element is - Design-Bar (form-item)
			animation_type = 'slide';
		}

		if ( 'hide' == $action ) {

			$element
				.removeClass('l_admin-show-if-visible')
				.addClass('l_admin-show-if-hidden')
				.attr( 'data-closed-by', 'layers-show-if-closed' );
			
			// Hide
			if( animation_type == 'slide' ){
				$element.slideUp( { duration: $show_if_animation_duration, easing: 'layersEaseInOut', complete: function(){
					$element.addClass( 'l_admin-hide' );
				} } );
			}
			else{
				$element.addClass( 'l_admin-hide' );
			}
		}
		else {
			
			$element
				.removeClass('l_admin-show-if-hidden')
				.addClass('l_admin-show-if-visible')
				.attr( 'data-closed-by', '' );

			// Show
			if( animation_type == 'slide' ){
				$element.removeClass( 'l_admin-hide' );
				$element.slideDown( { duration: $show_if_animation_duration, easing: 'layersEaseInOut' } );
			}
			else{
				$element.removeClass( 'l_admin-hide' );
			}
		}
	}
	
	/**
	 * 9 - Design-Bar Accordions
	 */

	// 9.a - Accordion Click

	$( document ).on( 'click', '.layers-group-start-wrapper', function(e){
		e.preventDefault();

		// Toggle clicked accordian.
		$me = $(this).closest( '.layers-design-bar-group' );
		$me.toggleClass( 'layers-design-bar-group-open' );
		$me.find( '.layers-design-bar-group-inner' ).slideToggle({ easing: 'layersEaseInOut', duration: 250 });

		// Close other open accordians.
		$siblings = $me.siblings('.layers-design-bar-group-open');
		$siblings.removeClass( 'layers-design-bar-group-open' );
		$siblings.find('.layers-design-bar-group-inner').slideUp({ easing: 'layersEaseInOut', duration: 250 });
	});
	
	// 9.b - Accordion Init
	
	$( document ).on( 'layers-interface-init', function( e, element ){
		layers_init_widget_accordians( $(element) );
	});

	function layers_init_widget_accordians( $element_s ){
		$element_s.find( '.layers-design-bar-group .layers-design-bar-group-inner' ).each( function(){
			$(this).hide();
		});
	}
	
	/**
	 * 10 - Control Accordions
	 */
	
	$accordion_and_tab_animation_duration = 200;

	// 10.a - Accordion Init
	
	$( document ).on( 'layers-interface-init', function( e, element ){
		// setTimeout(function() {
			
			layers_modify_control_classes( $(element) );
			
			$accordion_and_tab_animation_duration = 0;
			
			layers_init_control_accordians( $(element) );
			
			$accordion_and_tab_animation_duration = 200;
			
		// }, 200 );
	});

	function layers_init_control_accordians( $element_s ){
		
		$( $element_s.find( '.l_option-customize-control-accordion-start' ).get().reverse() ).each( function(){
			
			// Cache elements.
			var $current_accordion_start         = $(this).closest( '.customize-control-layers-accordion-start' );
			var $current_accordion_end           = $( '#' + $current_accordion_start.prop('id').replace( 'accordion-start', 'accordion-end' ) );
			var $current_accordion_start_and_end = $current_accordion_start.add( $current_accordion_end );
			var $sibling_controls                = $current_accordion_start.nextUntil( $current_accordion_end );
			
			// Enable the click open/closed.
			$current_accordion_start.on( 'click', function( index, el ) {
				
				if ( $current_accordion_start.hasClass( 'closed' ) ) {
					
					/**
					 * Open.
					 */
					
					$current_accordion_start_and_end
						.addClass( 'open' )
						.removeClass( 'closed' );
					
					$sibling_controls
						.filter( "[data-closed-by=" + $current_accordion_start.prop('id') + "]" )
						.attr( 'data-closed-by', '' )
						.stop( true, false )
						.each(function( index, el ) {
							$(el).slideDown({
								duration: $accordion_and_tab_animation_duration,
								easing: 'layersEaseInOut',
								done: function(){
									// Remove unnecessary styling.
									$(el).css({
										display: '',
										overflow: '',
										height: '',
									});
								},
							});
						});
					
					// We need to click any tabs to re-initialize them.
					$sibling_controls.each( function( index, el ) {
						$(el).find('.l_option-customize-control-tabs').each( function( index, el ) {
							$(el).find('.layers-interface-tab-active').click();
						});
					});
				}
				else {
					
					/**
					 * Close.
					 */
					
					$current_accordion_start_and_end
						.addClass( 'closed' )
						.removeClass( 'open' );
					
					$sibling_controls
						.not('[data-closed-by^="layers-customize-control-"], [data-closed-by^="customize-control-"], [data-closed-by="layers-show-if-closed"]')
						.attr( 'data-closed-by', $current_accordion_start.prop('id') )
						.stop( true, false )
						.each(function( index, el ) {
							
							$(el).slideUp({
								duration: $accordion_and_tab_animation_duration,
								easing: 'layersEaseInOut',
							});
						});
				}
				
				// Repaint the group styling after the accordions open or close.
				setTimeout(function() {
					layers_repaint_control_classes( $element_s );
				}, $accordion_and_tab_animation_duration );
			});
			
			// Close all the open accordions.
			$current_accordion_start.not('.accordion-open').click();
		});
	}
	
	/**
	 * 11 - Design-Bar Tabs
	 */

	// 11.a - Tabs Click

	$( document ).on( 'click', '.layers-design-bar .layers-interface-tabs label', function(e){
		e.preventDefault();

		// Toggle this accordian
		$current_tab = $(this);
		$tabs_buttons_holder = $(this).closest( '.layers-interface-tabs' );
		$other_tabs = $tabs_buttons_holder.find('label').not($current_tab);
		
		$current_tab.addClass('layers-interface-tab-active');
		$other_tabs.removeClass('layers-interface-tab-active');
		
		$current_tab.each(function(){
			$related_tab_id = $(this).attr('for');
			$( '#' + $related_tab_id ).slideDown({ easing: 'layersEaseInOut', duration: 250 });
		});
		$other_tabs.each(function(){
			$related_tab_id = $(this).attr('for');
			$( '#' + $related_tab_id ).slideUp({ easing: 'layersEaseInOut', duration: 250 });
		});
	});
	
	// 11.b - Tabs Init
	
	$( document ).on( 'layers-interface-init', function( e, element ){
		layers_init_tabs( $(element) );
	});

	function layers_init_tabs( $element_s ){
		$element_s.find( '.layers-design-bar .layers-interface-tabs').each( function(){
			$(this).find('label').eq(0).click();
		});
	}
	
	/**
	 * 12 - Control Tabs
	 */

	// 12.a - Tabs Init
	
	$( document ).on( 'layers-interface-init', function( e, element ){
		// setTimeout(function() {
			
			layers_modify_control_classes( $(element) );
			
			$accordion_and_tab_animation_duration = 0;
			
			layers_init_control_tabs( $(element) );
			
			$accordion_and_tab_animation_duration = 200;
			
		// }, 700 );
	});

	function layers_init_control_tabs( $element_s ){
		
		$element_s.find('.l_option-customize-control-tabs .layers-interface-tab').each( function( index, element ) {
			
			// Cache elements.
			var $current_tab               = $(this);
			var $current_tab_parent        = $current_tab.parents('.l_option-customize-control');
			var $other_tabs                = $current_tab_parent.find('.layers-interface-tab').not( $current_tab );
			var $all_tabs                  = $current_tab_parent.find('.layers-interface-tab');
			
			// Enable the click open/closed.
			$current_tab.on( 'click', function() {
				
				// Get the parents id.
				$current_tab_parent_id = $current_tab_parent.attr('id');
				
				
				$current_tab.addClass('layers-interface-tab-active');
				$other_tabs.removeClass('layers-interface-tab-active');
				
				
				$all_tabs.each( function( index, element ) {
					
					// Get the corresposnding intended tab.
					$tab_id = $(element).attr('for');
					
					var $tab               = $(this);
					var $tab_start         = $( '#' + $tab_id );
					var $tab_end           = $( '#' + $tab_start.prop('id').replace( 'tab-start', 'tab-end' ) );
					var $tab_start_and_end = $tab_start.add( $tab_end );
					var $tab_siblings      = $tab_start.nextUntil( $tab_end );
					
					if ( $tab.hasClass( 'layers-interface-tab-active' ) ) {
						
						/**
						 * Open.
						 */
						
						$tab_siblings
							.filter( "[data-closed-by=" + $current_tab_parent_id + "]" )
							.attr( 'data-closed-by', '' )
							.stop( true, false )
							.each(function( index, el ) {
								
								$(el).slideDown({ duration: 200, easing: 'layersEaseInOut', done: function(){
									
									// Remove unnecessary styling.
									$(el).css({
										display: '',
										overflow: '',
										height: '',
									});
								} });
							});
					}
					else {
						
						/**
						 * Close.
						 */
						
						$tab_siblings
							.not('[data-closed-by^="layers-customize-control-"], [data-closed-by^="customize-control-"], [data-closed-by="layers-show-if-closed"]')
							.attr( 'data-closed-by', $current_tab_parent_id )
							.stop( true, false )
							.each(function( index, el ) {
								
								$(el).slideUp({ duration: 200, easing: 'layersEaseInOut' });
							});
					}
				});
				
				// Repaint the group styling after the accordions open or close.
				setTimeout( function() {
					layers_repaint_control_classes( $element_s );
				}, $accordion_and_tab_animation_duration );
				
			});
		});
		
		// Click the first tab on startup.
		$element_s.find('.l_option-customize-control-tabs .layers-interface-tabs').each( function( index, el ) {
			$(el).find('.layers-interface-tab').eq(0).click();
		});
	}
	
	/**
	 * 13 - Paint special styles onto the Groups and Accordions.
	 */
	
	$( document ).on( 'layers-interface-init', function( e, element ){
		layers_modify_control_classes( $(element) );
		layers_repaint_control_classes( $(element) );
	});

	function layers_modify_control_classes( $element_s ){
		
		// Add `li-group` class to the parent - saves us having to peek into the children of the li each time to see if it's a group.
		$element_s.find('.l_option-customize-control').each( function(){
			var $control_li = $(this).parent('li');
			
			if ( $(this).hasClass( 'group' ) ) {
				$control_li.addClass('li-group');
			}
			if ( $(this).hasClass( 'accordion-open' ) ) {
				$control_li.addClass('accordion-open');
			}
			if ( -1 != $(this).attr('class').indexOf( 'layers-push-top' ) ) {
				$control_li.addClass('li-group-push-top');
			}
			if ( -1 != $(this).attr('class').indexOf( 'layers-push-top' ) ) {
				$control_li.addClass('li-group-push-top');
			}
			if ( -1 != $(this).attr('class').indexOf( 'layers-push-bottom' ) ) {
				$control_li.addClass('li-group-push-bottom');
			}
		});
	}
	
	function layers_repaint_control_classes( $element_s ){
		
		// return;
		
		$element_s.find('li.li-group, li.customize-control-layers-accordion-start').each( function(){
			
			// Get elements.
			var $control_li = $(this); // Get current element.
			var $control_li_prev_visible = $(this).prevAll('li:visible').first(); // Get previous visible element.
			var $control_li_next_visible = $(this).nextAll('li:visible').first(); // Get next visible element.
			
			// Remove all classes first.
			$control_li.removeClass('li-group-first li-group-last li-group-last-tight');
			
			// Don't waste time repainting if element is invisible.
			if ( ! $control_li.is(':visible') ) return;
			
			/**
			 * Groups.
			 */
			if ( $control_li.hasClass('li-group') ) {

				/**
				 * First in a group.
				 */
				if (
						(
							$control_li.hasClass('li-group') &&
							$control_li.hasClass('customize-control-layers-accordion-start')
						) ||
						$control_li.hasClass('li-group-push-top') ||
						! $control_li_prev_visible.hasClass('li-group')
					) {

					$control_li.addClass('li-group-first');
				}

				/**
				 * Last in a group.
				 */
				if (
						! $control_li_next_visible.hasClass('li-group') ||
						$control_li_next_visible.hasClass('customize-control-layers-accordion-start') ||
						$control_li_next_visible.hasClass('li-group-push-top')
					) {

					$control_li.addClass('li-group-last');
				}
			}
			
			/**
			 * Standard Accordions.
			 */
			
			if ( $control_li.not('.li-group').hasClass('customize-control-layers-accordion-start') ) {

				/**
				 * This standard accordion is directly after another.
				 */
				if ( $control_li.prev().hasClass('customize-control-layers-accordion-end') ) {
					
					$control_li.addClass('li-prev-is-accordion');
				}
			}
			
			// Debugging.
			/*if ( 'customize-control-layers-comments-name-accordion-start' == $control_li.attr( 'id' ) ) {
				console.log( $control_li.prev().attr('id') );
			}*/
		});
	}

	/**
	 * 14 - Widget Focussing
	 */

	$( document ).on( 'layers-widget-scroll', '.widget', function(e){

		// "Hi Mom"
		$that = $(this);

		if( !$that.hasClass( 'expanded' ) ){

			// Get the id of this widget
			$widget_id = $that.find( '.widget-id' ).val();

			// Focus on the active widget
			layers_widget_focus( $widget_id )
		}
	});

	function layers_widget_focus( $widget_id ){

		// Scroll to this widget
		$iframe = $( '#customize-preview iframe' ).contents();
		$widget = $iframe.find( '#' + $widget_id );

		// Check if the widget can be found - can't be found during widget-add
		if ( 0 < $widget.length ){
			$iframe.find('html, body').animate(
				{ scrollTop: $widget.offset().top },
				{ duration: 900, easing: 'layersEaseInOut' }
			);
		}
	}

	/**
	 * 15 - Trigger input changes
	 */

	$.fn.layers_trigger_change = function() {
		// Trigger 'change' and 'blur' to reset the customizer
		$changed = $(this).trigger("change").trigger("blur");
	};

	/**
	 * 16 - Add Last Class to Design-Bar Elements
	 */

	$( document ).on( 'layers-interface-init', function( e, element ){
		layers_init_add_last_class( $(element) );
	});

	function layers_init_add_last_class( $element_s ){

		$element_s.find( '.layers-design-bar').each( function( j, element ) {

			var $design_bar = $(element);
			var $design_bar_li = $design_bar.children('ul').children('li');

			if ( $design_bar.hasClass('layers-align-right') || $design_bar_li.length > 4 ) {

				$design_bar_li.eq(-1).addClass( 'layers-last' );
				$design_bar_li.eq(-2).addClass( 'layers-last' );
			}
		});
	}

	/**
	 * 17 - Init RTE Editors
	 */

	$( document ).on( 'layers-interface-init', function( e, element ){
		layers_init_editors( $(element) );
	});

	// Debugging
	// $editor_has_run_once = false;

	function layers_init_editors( $element_s ){

		$element_s.find('.layers-rte').each( function( j, element ) {

			var $editor = $(element);

			// Bail if I'm already an RTE.
			if ( $editor.siblings( '.fr-box' ).length > 0 ) return true;

			// Debugging - init a simple froala once then bail.
			// if ( $editor_has_run_once ) return;
			// $editor.froalaEditor();
			// $editor_has_run_once = true;
			// return false;

			// Default editor config.
			var $editor_config = {
				allowScript: true,
				allowStyle: true,
				convertMailAddresses: true,
				codeMirror: false,
				toolbarInline: false,
				initOnClick: false,
				tooltips: false,
				imageEditButtons: [ 'removeImage' ],
				key: 'YWd1WDPTa1ZNRGe1OC1c1==',
				mediaManager: false,
				imagePaste: false,
				enter: $.FroalaEditor.ENTER_P,
				pastePlain: false,
				typingTimer: 1500,
				zIndex: 99,
			};

			if ( $editor.data( 'allowed-buttons' ) ) {
				var allowed_buttons = $editor.data( 'allowed-buttons' ).split(',');
				$editor_config.toolbarButtons = allowed_buttons;
				$editor_config.toolbarButtonsMD = allowed_buttons;
				$editor_config.toolbarButtonsSM = allowed_buttons;
				$editor_config.toolbarButtonsXS = allowed_buttons;
			}

			if( $editor.data( 'allowed-tags' ) ) {
				if( '' !== $editor.data ){
					$editor_config.htmlAllowedTags = $editor.data( 'allowed-tags' ).split(',');
				}
			}

			// Init editor.
			$editor.froalaEditor( $editor_config );

			// Hide the toolbar at the start.
			$editor.froalaEditor('toolbar.hide');

			// Editor events
			$editor
				.on('froalaEditor.contentChanged froalaEditor.input', function (e, editor) {
					$editor.layers_trigger_change();
				})
				.on('froalaEditor.focus', function (e, editor) {
					$editor.froalaEditor('toolbar.show');
				});
		});

	}

	// Fix for 'clear formatting' button not working - invokes sending change to customizer prev
	$(document).on( 'click', '.fr-bttn[data-cmd="removeFormat"]', function(){
		var $editor = $(this).closest('.layers-form-item').find('.layers-rte');
		_.defer( function(arguments) {
			$editor.froalaEditor('blur');
			$editor.froalaEditor('focus');
		});
	});

	// Fix issue where Firefox performance slows down chronically while RTE's are still focussed by cursor.
	$(document).on( 'blur', '.fr-box .fr-element.fr-view', function(e){

		// Cache sister textarea.
		$textarea = $(e.target).parents('.fr-box').siblings('textarea');

		// Use near-instant timeout to make sure new element has time to get focus.
		setTimeout( function(){

			// Cache newly focussed element.
			$newly_focussed_element = jQuery(':focus');

			// Here is the fix:
			// If the next clicked element is a normal element (not a form field)
			// then Froala does not register the defocus of it's resource heavy
			// editor. So if the newly_focussed_element is not a form field then
			// we help by invisibly focussing Froala's hidden sister textarea which
			// releases the resource heavy Froala editor and returns performance
			// to it's normal state.
			if (
					! $newly_focussed_element.is('input') &&
					! $newly_focussed_element.is('textarea') &&
					! $newly_focussed_element.is('select') &&
					! $newly_focussed_element.parents().hasClass('fr-view') &&
					! $newly_focussed_element.hasClass('fr-view')
				) {

				// Focus hidden sister textarea (show, FOCUS, then hide again - is needed for focus to trigger correctly).
				$textarea.show().focus().hide();
			}

		}, 1 );
	});

	/**
	 * 18 - Custom Widget Initialization Events
	 */

	/**
	 * Trigger 'layers-interface-init' when:
	 * 1. widget is focussed first time
	 * 2. accordion element is added inside widget
	 * to allow for just-in-time init instead of massive bulk init.
	 */

	$( document ).on( 'widget-added', function( e, widget ){
		var $widget = $(widget);
		layers_expand_widget( $widget, e );
	});

	$( document ).on( 'expand collapse collapsed', '.customize-control-widget_form', function(e){

		var $widget_li = $(this);
		var $widget = $widget_li.find( '.widget' );

		if( 'expand' == e.type ){

			// duplicate call to 'layers_expand_widget' in-case 'click' is not triggered
			// eg 'shift-click' on widget in customizer-preview.
			layers_expand_widget( $widget, e );

			// Scroll only on expand.
			setTimeout(function() {
				$widget.trigger( 'layers-widget-scroll' );
			}, 200 );

			// Delay the removal of 'layers-loading' so it always displays for a definite length of time,
			// so the user is able to read it.
			setTimeout(function(){
				$widget_li.removeClass( 'layers-loading' );
			}, 1100 );
		}
		else if( 'collapse' == e.type ){

			$widget_li.removeClass('layers-focussed');

			// Used for animation of the widget closing
			$widget_li.addClass('layers-collapsing');
		}
		else if( 'collapsed' == e.type ){

			$widget_li.removeClass('layers-collapsing');
		}
	});

	function layers_expand_widget( $widget, e ){

		var $widget_li = $($widget).closest('.customize-control-widget_form');

		// Instant user feedback
		$widget_li.addClass('layers-focussed');

		// Instantly remove other classes on other widgets.
		$('.customize-control-widget_form.layers-focussed, .customize-control-widget_form.layers-loading').not( $widget_li ).removeClass('layers-focussed layers-loading');

		// Handle the first time Init of a widget.
		if ( ! $widget_li.hasClass( 'layers-loading' ) && ! $widget_li.hasClass( 'layers-initialized' ) ){

			$widget_li.addClass( 'layers-loading' );
			$widget_li.addClass( 'layers-initialized' );

			if ( 'widget-added' === e.type || 'click' === e.type ) {
				// If event is 'widget-added' it's our early invoked event so we can do things before all the WP things
				setTimeout(function(){
					$( document ).trigger( 'layers-interface-init', $widget );
				}, 50 );
			}
			else {
				// If event is 'expand' it's a WP invoked event that we use as backup if the 'click' was not used.
				// eg 'shift-click' on widget in customizer-preview
				$( document ).trigger( 'layers-interface-init', $widget );
			}
		}
	}

	/**
	 * Trigger 'layers-interface-init' when:
	 * 1. Accordion Panel/Section is expanded (opened)
	 */
	$( document ).on( 'expanded', '.control-section:not(.control-section-sidebar):not(#accordion-panel-widgets)', function(e){

		// Bail if we've a;ready initialized this.
		if ( $(this).hasClass('layers-initialized') ) return;
		
		// Old WP versions: check if theres nested accordions with controls that will also get init'd.
		// If so then mark these children accordions as `layers-initialized` so that their contained
		// controls don't get double init'd when they are expanded next.
		// This will result in e.g. two `click` event being added to a control.
		$(this).find('.control-section').each(function() {
			if ( $(this).children('ul').length ) {
				console.log('MARK NESTED INIT!');
				$(this).addClass('layers-initialized');
			}
		});

		// Add the 'initialized' class and trigger the event.
		$(this).addClass('layers-initialized');
		$(document).trigger('layers-interface-init', $(this) );
	});

	/**
	 * Trigger 'layers-widget-interface-init' when:
	 * 1. Widget Accordion Panel is expanded (opened)
	 */
	$( document ).on( 'expanded', '.control-section#accordion-panel-widgets li.control-section-sidebar', function(e){

		// Bail if we've a;ready initialized this.
		if ( $(this).hasClass('layers-initialized') ) return;

		// Add the 'initialized' class and trigger the event.
		$(this).addClass('layers-initialized');
		$(document).trigger('layers-widget-interface-init', $(this) );
	});


    /**
	 * Add Widget Delete Confirm Box
     */
    $.fn.layersWrapClick = function(before, after) {
        // Get and store the original click handler.
		$(this).each(function() {

			// Check if wrap click function was already used previously
			var alreadyWrapped = $._data(this, 'wrapped');

			// If so no need to wrap it again
			if (alreadyWrapped) {
				return;
			}
			// Set the wrapped data to true
            $._data(this, 'wrapped', true);

			// Get all the click events for the click of the button
            var clickEvents = $._data(this, 'events');

            // If no click events then set it to null
            clickEvents = clickEvents && clickEvents.click ? clickEvents.click: null;

            var allClickHandlers = [];
            if (clickEvents && clickEvents.length) {
                try {
                	// store all the click events in array
                    $.each(clickEvents, function(index, click) {
                        allClickHandlers.push(click.handler);
                    });

                    var _self = $(this);
                    // Remove click event from object.
                    _self.off('click');

                    // Add new click event with before and after functions.
                    return _self.click(function(e) {

                    	// Assuming that before call will allow execution of next/original call
                        var continueAfterBeforeCall = true;

                        // Assuming original call will allow execution of after call
                        var continueAfterCall = true;

                        // If there is a before function specified then call it
						// and check the return value
                        if (before && before.call) {
                            continueAfterBeforeCall = before.call(_self, e) !== false;
                        }
                        // If before call allows further continuation, then proceed with
						// Original call
                        if (continueAfterBeforeCall && allClickHandlers.length) {
                        	// Execute each and every event handler attached originally
                            $.each(allClickHandlers, function(index, _orgClick) {
                                if (_orgClick.call) {
                                    continueAfterCall = _orgClick.call(_self, e) !== false && continueAfterCall;
                                }
                            });
                        }

                        // If any of the call don't allow continuation of after call
						// do not execute the after call
                        if(continueAfterCall && after && after.call) {
                            after.call(_self, e);
                        }
                    });
                } catch (ex) {
                	// In case of any exception during the process
					// log the exception
					// @todo: Handle the exception
                    console.log(ex);
                }
            }
		});
    };

    $( document ).on( 'layers-interface-init', function(){
    	if (layers_customizer_params && layers_customizer_params.confirm_delete_text) {
			// Wrap around the original click event added by core wordpress.
            $('a.widget-control-remove').layersWrapClick(function() {
                return confirm(layers_customizer_params.confirm_delete_text);
            });
		}
	});


	/**
	 * 19 - Intercom checkbox
	 */

	$(document).on( 'change', '#layers-enable-intercom', function(e){

		if( 'undefined' !== typeof Intercom ){
			if( !$(this).prop('checked') ){
				Intercom('shutdown');
			} else if( 'undefined' !== typeof window.intercomSettings ){
				Intercom('boot', window.intercomSettings );
			}
		}

	});

	/**
	 * Duplicate Widgets. (disabled)
	 */
	/*
	$( document ).on( 'layers-interface-init', function( e, element ){
		// Add the duplicate widget button to all the Layers Widget actions.
		$(element).find('.widget-control-actions .alignleft .widget-control-remove').after('<a class="layers-widget-duplicate-button" title="Duplicate Widget">Duplicate</a>');
	});

	$( document ).on( 'click', '.layers-widget-duplicate-button', function( e, element ){
		$button = $(this);
		$this_widget_form = $button.parents('.widget-inside');
		$widget_panel_holder = $button.parents('.control-subsection.open');
		$add_widgets_button =  $widget_panel_holder.find('.add-new-widget');

		// Get the widget type.
		$widget_id = $this_widget_form.find('[name="id_base"]').val();

		$add_widgets_button.click();
		$('#available-widgets-list').find('[id^="widget-tpl-'+ $widget_id +'"]').click();
	});
	*/

	/**
	 * 20 - Widget Peek/hide to preview changes
	 */

	$( document ).on( 'layers-interface-init', function( e, element ){

		// Add the peek buttons to all the Layers Widget actions.
		$(element).find('.widget-control-actions .alignleft').prepend('<span class="layers-widget-peek-button dashicons dashicons-visibility">');
	});

	// Add the hover hiding of the Widget interface.
	$(document).on( 'mouseenter', '.layers-widget-peek-button', function(){ $(this).closest('.widget-inside').addClass('layers-peek-widget'); } );
	$(document).on( 'mouseleave', '.layers-widget-peek-button', function(){ $(this).closest('.widget-inside').removeClass('layers-peek-widget'); } );

	/**
	 * 21 - Customizer Control - Range Slider
	 */

	$( document ).on( 'input change', '.layers-column input[type="range"]', function( e ){

		// Push changes to the Number input.
		var $range_field = $(this);
		var $number_field = $(this).parent().parent().find('input[type="number"]');

		if ( $range_field.attr( 'placeholder' ) && $range_field.attr( 'placeholder' ) == $range_field.val() ) {

			// If the range-slider is moved and there's a placeholder set
			// and the slider stops on the placeholder value then empty
			// the number field so nothing is applied.
			$number_field.val('');
			$number_field.addClass( 'layers-range-disabled' );
		}
		else {

			// Set the number value to equal this range.
			$number_field.val( $range_field.val() );
			$number_field.removeClass( 'layers-range-disabled' );
		}

		layers_debounce_range_input( $number_field );
	});
	$( document ).on( 'input change', '.layers-column input[type="number"]', function( e ){

		// Push changes to the Range input.
		var $number_field = $(this);
		var $range_field = $(this).parent().parent().find('input[type="range"]');

		if ( '' == $number_field.val() && $range_field.attr( 'placeholder' ) ) {

			// If number field is emptied and there's a placeholder set then
			// set the range slider so it reflects the placeholder too.
			$range_field.val( $range_field.attr( 'placeholder' ) );
		}
		else {

			// Set the range to equal this number value.
			$range_field.val( $number_field.val() );
		}
	});

	var layers_debounce_range_input = _.debounce( function( element ){
		$( element ).layers_trigger_change();
	}, 550, false );

	/**
	 * 22 - Reset to Default
	 */

	$( document ).on( 'click', '.customize-control-default', function( e ){

		var $refresh_button = $(this);
		var $control_holder = $refresh_button.closest('.customize-control');
		var $default_value = $refresh_button.attr('data-default');

		var $field = $control_holder.find('input, select, textarea');

		if ( 'checkbox' == $field.eq(0).attr('type') ) {

			// Checkbox
			if ( ! $default_value || '' == $default_value ) $field.attr( 'checked', false );
			else $field.attr( 'checked', true );
			$field.eq(0).change();
		}
		else {
		//else if ( $field.eq(0).is('input') ) {

			// Input's, Textarea
			$field.val( $default_value );
			$field.eq(0).change();
		}
	});

	/**
	 * 23 - Linking from one section/panel to another.
	 *
	 * Use class `customizer-link` and href `#target-panel-or-section-id`
	 */

	$( document ).on( 'click', '.customizer-link', function( e ){

		$link              = $(this);
		$related_accordion = $( $link.attr('href') );

		// If there is a related panel ot section then open it.
		if ( $related_accordion.length ) {
			$related_accordion.children( 'h3.accordion-section-title' ).click();
		}

		return false;
	});

	/**
	 * 24 - Init Tip-Tip
	 */

	if ( $('body.wp-customizer').length ) {

		/**
		 * Customizer
		 */

		$( document ).on( 'layers-interface-init', function( e, element ){
			init_tip_tip( $(element) );
		});
	}
	else{

		/**
		 * Not Customizer
		 */

		init_tip_tip( $( document ) );
	}

	function init_tip_tip( $element_s ){

		$element_s.find( '[data-tip]').each( function( j, element ) {

			// Tooltips
			$(element).layersTip({
				'attribute' : 'data-tip',
				'fadeIn' : 300,
				'fadeOut' : 300,
				'delay' : 200,
				'defaultPosition' : 'top',
				'edgeOffset' : 3,
				'maxWidth' : '300px'
			});
		});
	}

	/**
	 * 25 - Linking-UX
	 */

	$( document ).on( 'layers-interface-init', function( e, element ){
		layers_init_form_collections( $(element) );
	});

	function layers_init_form_collections( $element_s ){

		/**
		 * Get the link-type inputs and convert them to layersSlct2.
		 */

		$element_s.find( '.layers-widget-dynamic-linking-select').each( function( j, element ) {

			var initial_selection = {
				id   : $(element).val(),
				text : $(element).attr( 'data-display-text' ),
			};
			var placeholder = $(element).attr( 'placeholder' );

			var related_type_select = $(element).parents('.layers-form-collection').find('[id$="-link_type"]');

			$(element).layersSlct2({
				ajax: {
					url: ajaxurl,
					dataType: 'json',
					quietMillis: 250,
					data: function(term, page) {

						return {
							action    : 'layers_widget_linking_searches',
							link_type : related_type_select.val(),
							term      : term,
							page      : page,
							nonce     : layers_admin_params.nonce_layers_widget_linking,
						};
					},
					results: function(data, params) {

						return {
							results: data.results,
							more: data.more,
						};
					},
					cache: true
				},
				escapeMarkup: function(markup) {

					// let our custom formatter work
					return markup;
				},
				initSelection: function(element, callback) {

					callback( initial_selection );

					// Convert the value to a Name by doing reverse-lookup of the id. - Replaced this method with the ajax-free method above.
					/*
					var id = $(element).val();
					if (id !== "") {
						jQuery.ajax({
							type     : 'post',
							dataType : 'json',
							url      : ajaxurl,
							data     : {
								action    : 'layers_widget_linking_initial_selections',
								post_id   : id,
								link_type : related_type_select.val(),
								nonce     : layers_admin_params.nonce_layers_widget_linking,
							},
							success: function( data ) {
								callback({
									id: data.id,
									text: data.text
								});
							}
						});
					}
					*/
				},
				formatSelection: function(data) {

					return data.text;
				},
				containerCssClass: 'tpx-layersSlct2-container',
				dropdownCssClass: 'tpx-layersSlct2-drop',
				minimumInputLength: 1,
				width: '100%',
			});

			$(element).on('change', function(e) {
				$(element).attr( 'data-display-text', e.added.text ).trigger('layers_init_linking');
			})

		});

		/**
		 * Dynamic updating of the Linking-UX heading.
		 */
		$element_s.find('.layers-form-collection').each( function( j, element ) {

			// Cache elements.
			var $collection_holder = $(element);
			var $collection_content = $collection_holder.find('.layers-form-collection-content');
			var $collection_heading = $collection_holder.find('.layers-form-collection-header');

			// Hide content part - like an accordion.
			$collection_content.hide();

			// Update the heading on change of any input/select.
			$(element).find('select, input').on( 'change keyup layers_init_linking', function(){

				// Get the link text.
				var link_text = $(element).find('[id$="-link_text"]').val();

				// Get the link type.
				var link_type = $(element).find('[id$="-link_type"]').val();

				// Get the link value.
				var link_input = $(element).find('[name$="link_type_' + link_type + ']"]');

				link_value = '';
				if ( 'custom' == link_type )
					link_value = link_input.val();
				else if ( 'post' == link_type )
					link_value = link_input.attr('data-display-text');

				// Compile the display content.
				var display_content = '';

				if ( '' != link_text )
					display_content += link_text + ' ';

				if ( '' != link_value )
					display_content  += '<i title="' + link_value + '">' + link_value + '</i> ';


				// If nothing is set then throw out &nbsp; to hold the space.
				if ( '' == display_content ) display_content = '&nbsp;';

				$collection_heading.html( display_content );
			});

			// Ping an initial update at the start.
			$(element).find('select, input').eq(0).trigger('layers_init_linking');
		});
	}

	// Accordion-type panel of the Linking-UX
	$(document).on('click', '.layers-form-collection-header', function(){

		/**
		 * Show the current panel.
		 */
		$collection_holder = $(this).closest('.layers-form-collection');
		$collection_content = $collection_holder.find('.layers-form-collection-content');

		if ( $collection_holder.hasClass('closed') ) {
			$collection_holder.removeClass('closed');
			$collection_content.slideDown({ easing: 'layersEaseInOut', duration: 250 });
		}
		else{
			$collection_holder.addClass('closed');
			$collection_content.slideUp({ easing: 'layersEaseInOut', duration: 250 });
		}

		/**
		 * Hide the other panel (that are still showing)
		 */
		$other_collection_holders = $('.layers-form-collection:not(".closed")').not( $collection_holder );
		$other_collection_contents = $other_collection_holders.find('.layers-form-collection-content');

		$other_collection_holders.addClass('closed');
		$other_collection_contents.slideUp({ easing: 'layersEaseInOut', duration: 250 });
	});

	/**
	 * 26 - Force Customizer refresh if Widget exists that's not partial-widget-refresh.
	 *
	 * This is required because we don't use the `$args['before_widget'], $args['after_widget']` as our surrounding
	 * tags on our widgets, as our framework needs full control of the attributes like `class`. We have solved this
	 * in our internal widgets, but we cannot be sure that there aren't any 3rd party Layers based Widgets that
	 * have not yet applied our fix. So in the case that there are non `customize_selective_refresh` enabled Widgets
	 * then we will hard-refresh the customizer if the widgets are Reordered, Added, Deleted. Only on pages that have
	 * Widgets that are not `customize_selective_refresh` enabled.
	 */
	
	$(document).on( 'layers-customizer-init', function(){

		// Reorder Widgets.
		$('.accordion-section-content').on( 'sortupdate', function( event, ui ){
			var $widget_li = ui.item;
			possibly_refresh_customizer( $widget_li );
		});

		// Add Widget.
		$( document ).on( 'widget-added', function( e, widget ){
			var $widget = $(widget);
			possibly_refresh_customizer( $widget );
		});

		// Delete Widget.
		$('.accordion-section-content').on( 'click', '.widget-control-remove', function(e){
			var $widget = $(this).closest('.customize-control-widget_form');
			possibly_refresh_customizer( $widget );
		});

	});

	function possibly_refresh_customizer( $widget ) {

		// Bail if old version of WP and SelectvieRfresh is not available yet.
		if ( undefined == wp.customize.Widgets.data.selectiveRefreshableWidgets )
			return false;

		// Keep note if there are any non PWR widgets.
		var $all_partial_refresh_widget_enabled = true;

		if ( ! wp.customize.Widgets.data.selectiveRefreshableWidgets[ $widget.find('input[name=id_base]').val() ] ) {

			// The current widget clicked is not PWR so note this.
			$all_partial_refresh_widget_enabled = false;
		}
		else {

			// Loop through the widget on the same page as the one that was just interacted with.
			$widget.closest('.ui-sortable').find('input[name=id_base]').each(function(index, el){

				// Get the widget type.
				var widget_type = $(el).val();

				// Check if the current widget is PWR enabled.
				if ( ! wp.customize.Widgets.data.selectiveRefreshableWidgets[widget_type] ) {

					// If not PWR then note this.
					$all_partial_refresh_widget_enabled = false;
				}
			});
		}

		// If there was a non PWR then refresh the Customizer Preview.
		if ( ! $all_partial_refresh_widget_enabled ) {

			// setTimeout delay so that the accordion is finished updating.
			setTimeout( function(){
				wp.customize.previewer.refresh();
			}, 600 );
		}
	}

});