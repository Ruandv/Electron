using System;
using System.Collections.Generic;
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
        static string[] images;
        static Dictionary<string, ulong> imageArray = new Dictionary<string, ulong>();
        static Dictionary<string, ulong> processed = new Dictionary<string, ulong>();
        static ImageHashes imageHasher1 = new ImageHashes(new ImageMagickTransformer());
        static void Main(string[] args)
        {
            if (args.Count() > 0)
            {
                images = Directory.GetFiles(args[0], "*.jpg");
                Console.WriteLine(args[1]);
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
            
            if (!File.Exists($"{args[0]}ImageArray.json"))
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
                foreach (var t in tasks)
                {
                    Console.WriteLine($"Starting Thread {t.Name}");
                    t.Start();
                }
                while (tasks.Any(x => x.IsAlive))
                {

                }
                File.WriteAllText($"{args[0]}ImageArray.json", System.Text.Json.JsonSerializer.Serialize(imageArray));
            }
            else
            {
                imageArray = System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, ulong>>(File.ReadAllText($"{args[0]}ImageArray.json"));
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
                                    }

									.top-row{
										 margin-top:200px; 
                                         position:fixed;
									}
									
                                    .grayScale{
                                        filter: gray; /* IE6-9 */
                                        -webkit-filter: grayscale(1); /* Google Chrome, Safari 6+ & Opera 15+ */
                                        filter: grayscale(1); /* Microsoft Edge and Firefox 35+ */
                                    }
                                </style>
                                <script src = 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.min.js' ></script>
                                <link href = 'https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.4.1/css/bootstrap.min.css' rel = 'stylesheet'>
                                <script src = 'https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.4.1/js/bootstrap.bundle.js' ></script >
                                <script>
	                                var array = [];
                                    function updateHTML(item,index){
                                        document.getElementById('myData').innerHTML += item+'<br>';
                                    }

	                                function isDuplicate(path,salue){
                                        var img = document.getElementById(path);
                                        if(img.className.indexOf('grayScale')>-1)
                                        {
                                            array.splice( array.indexOf('del /f ' + path.split('/').join('\\')), 1);
                                            img.className = img.className.replace('grayScale','');
                                        }
                                        else
		                                {
                                            array.push('del /f ' + path.split('/').join('\\'));
                                            img.className += ' grayScale';
                                        }
                                        document.getElementById('myData').innerHTML ='';
                                        array.forEach(updateHTML);                                        
                                    }
                                </script>
                            </head>
                        <body class='myBody'>
                            <div class='container'>
							<div class = 'row top-row'>

                            </div >
                           <div id ='myData'>No Items Selected</div>"
                        );

            processed = new Dictionary<string, ulong>();
            foreach (var img in imageArray)
            {
                foreach (var comp in imageArray.Where(x => !processed.Select(p => p.Key).Contains(x.Key)))
                {
                    var similarity = ImageHashes.CompareHashes(img.Value, comp.Value);
                    if (similarity > threshold && !comp.Key.Equals(img.Key))
                    {
                        sb.Append(@$"
                                    <div class='row text-center'>
                                        <div class='col-lg-6 col-md-6 mb-4'>
                                            <div class='card h-100'>
                                                <img id ='{img.Key.Replace("\\", "/")}' class='card-img-top' src='{img.Key}' alt=''>
                                                <div class='card-body'>
                                                    <h4 class='card-title'>Original</h4>
                                                    <p class='card-text'>
                                                        FileName : {img.Key.Substring(img.Key.LastIndexOf("\\") + 1)}
                                                    </p>
                                                </div>
                                                <div class='card-footer'>
                                                    <div id ='{img.Value + comp.Value}' onclick = isDuplicate('{img.Key.Replace("\\", "/")}','{img.Value}') class='btn btn-danger'>Is Duplicate</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class='col-lg-6 col-md-6 mb-4'>
                                            <div class='card h-100'>
                                                <img id ='{comp.Key.Replace("\\", "/")}' class='card-img-top' src='{comp.Key}' alt=''>
                                                <div class='card-body'>
                                                    <h4 class='card-title'>Duplicate : {similarity}</h4>
                                                    <p class='card-text'>
                                                        FileName : {comp.Key.Substring(comp.Key.LastIndexOf("\\") + 1)}
                                                        </p>
                                                </div>
                                                <div class='card-footer'>
                                                    <div id ='{img.Value + comp.Value}' onclick = isDuplicate('{comp.Key.Replace("\\", "/")}','{comp.Value}') class='btn btn-danger'>Is Duplicate</div>
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
            sb.Append(@" </div></body></html>");
            var sw = new StreamWriter($"{args[0]}results.html");
            sw.Write(sb);
            sw.Close();
        }

        private static void ProcessImage(Dictionary<string, ulong> imageArray, ImageHashes imageHasher1, string img)
        {
            var hash1 = imageHasher1.CalculateDctHash(img);
            imageArray.Add(img, hash1);
        }
    }
}
