using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading;
using DupImageLib;

namespace ImageDuplicateFinder
{
    class Program
    {
        private static float threshold = 0.96f;
        static List<string> images = new List<string>();
        static Dictionary<string, ulong> imageArray = new Dictionary<string, ulong>();
        static Dictionary<string, ulong> processed = new Dictionary<string, ulong>();
        static ImageHashes imageHasher1 = new ImageHashes(new ImageMagickTransformer());
        static void Main(string[] args)
        {
            var filters = new String[] { "jpg", "jpeg", "png", "gif", "tiff", "bmp", "svg" };
            if (args.Count() > 0)
            {
                foreach (var filter in filters)
                {
                    images.AddRange(Directory.GetFiles(args[0], $"*.{filter}"));
                }
                threshold = float.Parse(args[1]);
            }
            else
            {
                string reading = "0";
                do
                {
                    Console.WriteLine($"What is the Threshold? default = {threshold}");
                    reading = Console.ReadLine();
                    reading = (reading == "" ? reading = "0" : reading);
                } while (float.Parse(reading) > 1);

                if (reading != "0")
                {
                    threshold = float.Parse(reading);
                }
            }

            var i = 0;

            if (!File.Exists(Path.Combine(args[0], "ImageArray.json")))
            {
                List<Thread> tasks = new List<Thread>();

                foreach (var img in images)
                {
                    if (i % 100 == 0)
                        Console.WriteLine($"Loading Thread {i}");
                    var tsk = new Thread(r =>
                    {
                        ProcessImage(imageArray, imageHasher1, img);
                        Console.WriteLine("Thread Completed " + Thread.CurrentThread.Name);
                    });
                    tsk.Name = $"MyThread {i}";
                    tasks.Add(tsk);
                    i++;
                }

                // Start the Threads
                foreach (var t in tasks)
                {
                    Console.WriteLine($"Starting Thread {t.Name}");
                    t.Start();
                }

                // Wait for all the threads to finish
                while (tasks.Any(x => x.IsAlive))
                {

                }

                File.WriteAllText(Path.Combine(args[0], "ImageArray.json"), System.Text.Json.JsonSerializer.Serialize(imageArray));
            }
            else
            {
                imageArray = System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, ulong>>(File.ReadAllText(Path.Combine(args[0], "ImageArray.json")));
            }

            i = 0;
            var sb = new StringBuilder();
            sb.Append(@"
                        <html>
                            <head>
                                <style>
									.myBody {
										background-image: linear-gradient(#061212, #a6a6a6);
									}

									#myData{
                                        color:white;
                                        position:fixed; 
                                        top: 0px; 
                                        right: 0px;
                                        display:none;
                                    }
                                    .card-img-top {
                                        height: 300px;
                                        object-fit: cover;
                                    }
									.top-row{
										 margin-bottom:20px; 
                                         padding-left:30%;
									}

									.actionButton{
                                        margin: 2px;
                                    }
                                    
                                    .hilight{
                                        color:red
                                    }

                                    .grayScale{
                                        filter: gray; /* IE6-9 */
                                        -webkit-filter: grayscale(1); /* Google Chrome, Safari 6+ & Opera 15+ */
                                        filter: grayscale(1); /* Microsoft Edge and Firefox 35+ */
                                    }

									.grayScale .msg::after{
										  content:'';
										  position: absolute;    
										  top: 102px;     
										  width: 80%;
										  height: 40px;
										  left: 10%;  
										  background: RED; 
										  color: white;
										  font-size: 20px;
										  margin :20px;
										  text-align: center;
										  transform: rotate(20deg);
                                    }
									
									.grayScale .msg::before{
										  content:'DELETE';
										  position: absolute;    
										  top: 102px;     
										  width: 80%;
										  height: 40px;
										  left: 10%;  
										  background: RED; 
										  color: white;
										  z-index:200;
										  font-size: 20px;
										  margin :20px;
										  text-align: center;
										  transform: rotate(-20deg);
                                    }
                                </style>
                                <script src = 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.min.js'></script>
                                <script src = 'https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.4.1/js/bootstrap.bundle.js'></script >
                                <link href = 'https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.4.1/css/bootstrap.min.css' rel = 'stylesheet'>                                
                                <script>
	                                var array = [];
                                    function updateHTML(item,index){
                                        document.getElementById('myData').innerHTML += item+'<br>';
                                    }

	                                function isDuplicate(path,val){
                                        document.querySelectorAll('#img_' + val).forEach( img =>
                                        {
                                            if(img.className.indexOf('grayScale')>-1)
                                            {
                                                array.splice( array.indexOf({id:val,cmd:'del /f ' + path.split('/').join('\\')}), 1);
                                                img.className = img.className.replace('grayScale','');
                                            }
                                            else
		                                    {
                                                array.push({id:val,cmd:'del /f ' + path.split('/').join('\\')});
                                                img.className += ' grayScale';
                                            }
                                            document.getElementById('myData').innerHTML ='';
                                        });
                                        array.forEach(updateHTML);                                        
                                    }

                                    function resetArray(){
                                        var removeArray = [];

                                        /* Make sure we only get a distinct List*/
                                        const map = new Map();
                                        for (const item of array) {
                                            if(!map.has(item.id)){
                                                map.set(item.id, true);    // set any value to Map
                                                removeArray.push({
                                                    id: item.id,
                                                    cmd: item.cmd
                                                });
                                            }
                                        }
                                        /* now go and remove the grayscale class*/
                                         removeArray.forEach(
                                         x=>{
                                            var fn = x.cmd.replace('del /f ','').split('\\').join('/');
                                            var id = x.id;
                                            console.log(fn); 
                                            isDuplicate(fn,id);
                                         });
                                    }
                                </script>
                            </head>
                        <body class='myBody'>
                            <div class='container'>
							<div id='actionButtons' class = 'row top-row'>
                                <div class='btn btn-primary actionButton' id ='actionButton'>BACK</div>
                                <div class='btn btn-primary actionButton' id ='actionButton'>DELETE</div>
                                <div class='btn btn-primary actionButton' id ='actionButton'>IDENTIFY</div>
                                <div class='btn btn-primary actionButton' id ='actionButton' onclick = 'resetArray()'>RESET</div>
                            </div>
                           <div id ='myData'>No Items Selected</div>
                            <div id='parent-list'>
                            ");

            processed = new Dictionary<string, ulong>();
            foreach (var img in imageArray)
            {
                foreach (var comp in imageArray.Where(x => !processed.Select(p => p.Key).Contains(x.Key)))
                {
                    var similarity = ImageHashes.CompareHashes(img.Value, comp.Value);
                    if (similarity > threshold && !comp.Key.Equals(img.Key))
                    {
                        var fimg = new FileInfo(img.Key);
                        var fcomp = new FileInfo(comp.Key);
                        var pimg = Image.FromFile(img.Key);
                        var pcomp = Image.FromFile(comp.Key);

                        sb.Append(@$"
                                    <div class='row text-center'>
                                        <div class='col-lg-6 col-md-6 mb-4'>
                                            <div class='card'>
                                                <div id ='img_{img.Value}' class='imgWrapper'><div class='msg'></div>
                                                    <img class='card-img-top' src='{img.Key}' alt=''>
                                                </div>
                                                <div class='card-body'>
                                                    <h4 class='card-title'>Original</h4>
                                                    <p class='card-text'>
                                                        <div class='{(img.Key == comp.Key ? "" : "hilight")}'>FileName : {img.Key.Substring(img.Key.LastIndexOf("\\") + 1)}</div>
                                                        <div class='{(fimg.Length == fcomp.Length ? "" : "hilight")}'>FileSize : {fimg.Length}</div>
                                                        <div class='{(fimg.CreationTime == fcomp.CreationTime ? "" : "hilight")}'>Created Date : {fimg.CreationTime}</div>
                                                        <div class='{(pimg.PhysicalDimension == pcomp.PhysicalDimension ? "" : "hilight")}'>Dimensions : {pimg.PhysicalDimension.Width}</div>
                                                        <div class='{(pimg.HorizontalResolution == pcomp.HorizontalResolution ? "" : "hilight")}'>Resolution : {(pimg.HorizontalResolution == pimg.VerticalResolution ? pimg.HorizontalResolution.ToString() : (pimg.HorizontalResolution).ToString() + "x" + pimg.VerticalResolution)}</div>
                                                    </p>
                                                </div>
                                                <div class='card-footer'>
                                                    <div id ='{img.Key.Replace("\\", "/")}' onclick = isDuplicate('{img.Key.Replace("\\", "/")}','{img.Value}') class='btn btn-danger'>Is Duplicate</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class='col-lg-6 col-md-6 mb-4'>
                                            <div class='card'>
                                                <div id ='img_{comp.Value}' class='imgWrapper'><div class='msg'></div>
                                                    <img class='card-img-top' src='{comp.Key}' alt=''>
                                                </div>
                                                <div class='card-body'>
                                                    <h4 class='card-title'>Duplicate : {similarity * 100}</h4>
                                                    <p class='card-text'>
                                                        <div>FileName : {comp.Key.Substring(comp.Key.LastIndexOf("\\") + 1)}</div>
                                                        <div>FileSize : {fcomp.Length}</div>
                                                        <div>Created Date : {fcomp.CreationTime}</div>
                                                        <div>Dimensions : {pcomp.PhysicalDimension.Width}</div>
                                                        <div>Resolution : {(pcomp.HorizontalResolution == pcomp.VerticalResolution ? pcomp.HorizontalResolution.ToString() : (pcomp.HorizontalResolution).ToString() + "x" + pcomp.VerticalResolution)}</div>
                                                        </p>
                                                </div>
                                                <div class='card-footer'>
                                                    <div id ='{img.Key.Replace("\\", "/")}' onclick = isDuplicate('{comp.Key.Replace("\\", "/")}','{comp.Value}') class='btn btn-danger'>Is Duplicate</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    ");
                        Console.WriteLine($"{i} Comparing {img.Key}");
                        Console.WriteLine($"{Math.Round(similarity, 6, MidpointRounding.ToPositiveInfinity)}\t\t{comp.Key}");
                    }
                }
                processed.Add(img.Key, img.Value);
                i++;
            }
            sb.Append(@" </div>");
            sb.Append(@"</div>");//parent-list
            sb.Append(@"<script>require('./results')</script>");
            sb.Append(@"</body></html>");
            var sw = new StreamWriter(Path.Combine(args[0], "results.html"));

            sw.Write(sb);
            sw.Close();
            File.Copy(".\\results.js", Path.Combine(args[0], "results.js"), true);
        }

        private static void ProcessImage(Dictionary<string, ulong> imageArray, ImageHashes imageHasher1, string img)
        {
            var hash1 = imageHasher1.CalculateDctHash(img);
            imageArray.Add(img, hash1);
        }
    }
}
