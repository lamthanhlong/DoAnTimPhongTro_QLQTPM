using System;
using System.Collections.Generic;
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
            //args = new string[] { @"E:\Projects\TimPhongTro_QLQTPM\DoAnTimPhongTro_QLQTPM\Crawler_PhongTro123\PhongTro123.xml" };
            if (args.Length <= 0) return;
            try
            {
                WriteColor("# Loading config file...", ConsoleColor.Yellow);
                if (!Config.ReadConfig(args[0]))
                {
                    WriteColor("ERROR: Couldn't Found Config File!", ConsoleColor.Blue);
                    Console.ReadLine();
                    return;
                }
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
                    Console.WriteLine();
                }
                WriteColor("# Writing JSON file...", ConsoleColor.Yellow);
                JSON.WriteFile(lst);
                WriteColor("\n# Completed!", ConsoleColor.Green);
            }
            catch(Exception ex)
            {
                WriteColor("================== ERROR ==================", ConsoleColor.Blue);
                Console.Write(ex);
            }
            Console.ReadLine();
        }

        static void WriteColor(string text, ConsoleColor color)
        {
            Console.ForegroundColor = color;
            Console.WriteLine(text);
            Console.ResetColor();
        }
    }
}
