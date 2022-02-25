$(function(){
    //get concertina folders and add event listeners
    var folders = $('.folder-name');
    for(var folder of folders){
        $(folder).click(function(e){
            expand(e.currentTarget);
        });
    }

});

//expands a given folder
function expand(clickedFolder){
    var content = $(clickedFolder).parent().find('.folder');
    
    var visible = (content.hasClass('open'));
    if(visible){
        content.removeClass('open');
        $(clickedFolder).attr('icon', '+');
    }
    else{
        content.addClass('open');
        $(clickedFolder).attr('icon', '-');

    }
}
