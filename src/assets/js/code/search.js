$(function(){
  const ratingg = $('div[id^="rating-"]')
  if (ratingg){
    const rating = ratingg.attr('id').split("-")[1]
    $('#5').prop("checked",(rating == 5));
    $('#4').prop("checked",(rating == 4));
    $('#3').prop("checked",(rating == 3));
    $('#2').prop("checked",(rating == 2));
    $('#1').prop("checked",(rating == 1));
    $('#0').prop("checked",(rating == 0));
  }
   const min_b = $('.minrange1')
   const max_b = $('.maxrange1')
   const min_b1 = $('.minrange2')
   const max_b1 = $('.maxrange2')
   const min_b2 = $('.minrange3')
   const max_b2 = $('.maxrange3')
   const min_b3 = $('.minrange4')
   const max_b3 = $('.maxrange4')
   if (min_b && max_b){
     max_b.change(function(){
       console.log(min_b.val())
       console.log(max_b.val())
       if (parseInt(max_b.val()) < parseInt(min_b.val())){
         max_b.val(min_b.val())
         max_b1.val(min_b1.val())
       }
     })
     min_b.change(function(){
       console.log(min_b.val())
       console.log(max_b.val())
       if (parseInt(max_b.val()) < parseInt(min_b.val())){
         min_b.val(max_b.val())
         min_b1.val(max_b1.val())
       }
     })
     max_b2.change(function(){
       console.log(min_b.val())
       console.log(max_b.val())
       if (parseInt(max_b2.val()) < parseInt(min_b2.val())){
         max_b2.val(min_b2.val())
         max_b3.val(min_b3.val())
       }
     })
     min_b2.change(function(){
       console.log(min_b.val())
       console.log(max_b.val())
       if (parseInt(max_b2.val()) < parseInt(min_b2.val())){
         min_b2.val(max_b2.val())
         min_b3.val(max_b3.val())
       }
     })

   }
});
