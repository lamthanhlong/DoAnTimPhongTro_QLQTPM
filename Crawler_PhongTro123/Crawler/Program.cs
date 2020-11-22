using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading;

namespace Crawler
{
    class Program
    {
        [Obsolete]
        static void Main(string[] args)
        {
            args = new string[] { @"E:\Projects\TimPhongTro_QLQTPM\DoAnTimPhongTro_QLQTPM\Crawler_PhongTro123\PhongTro123.xml" };
            if (args.Length <= 0) return;
            Console.Title = $"CRAWLER [{Path.GetFileName(args[0])}]";
            Console.WriteLine("Crawler Tool [Version 1.0]\n");
            try
            {
                WriteColor("# Loading config file...", ConsoleColor.Yellow);
                if (!Config.ReadConfig(args[0]))
                {
                    WriteColor("ERROR: Couldn't Found Config File!", ConsoleColor.Blue);
                    Console.ReadLine();
                    return;
                }
                Console.WriteLine();
                List <JSON> lst = new List<JSON>();
                var mainThread = Thread.CurrentThread;
                for (int i = Config.StartPage; i < Config.StartPage + Config.TotalPage; i++)
                {
                    WriteColor("# Start Reading Page " + i, ConsoleColor.Yellow);
                    var links = HttpService.GetDetail_URLs(Config.MainURL + i);
                    if (links.Count == 0) continue;
                    var count = 0;
                    foreach(var link in links)
                    {
                        ThreadPool.QueueUserWorkItem((obj)=>{
                            var item = HttpService.GetDetailPage(link);
                            Console.WriteLine(link.Substring(link.LastIndexOf("/") + 1));
                            lock (lst){
                                lst.Add(item);
                                count++;
                                if (count == links.Count) mainThread.Resume();
                            }
                        });
                    }
                    mainThread.Suspend();
                    if (lst.Count >= Config.RecordPerFile || i == Config.StartPage + Config.TotalPage - 1)
                    {
                        WriteColor($"# Writing JSON file [{Config.TotalFile}]...", ConsoleColor.Yellow);
                        JSON.WriteFile(lst);
                        lst.Clear();
                    }
                    Console.WriteLine();
                }
                WriteColor($"\n# Completed!, {Config.TotalFile - 1} File is Exported.", ConsoleColor.Green, false);
            }
            catch(Exception ex)
            {
                WriteColor("================== ERROR ==================", ConsoleColor.Blue);
                Console.Write(ex);
            }
            Console.ReadLine();
        }

        static void WriteColor(string text, ConsoleColor color, bool isNewLine = true)
        {
            Console.ForegroundColor = color;
            if(isNewLine) Console.WriteLine(text);
            else Console.Write(text);
            Console.ResetColor();
        }
    }
}
