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
            if (args.Length <= 0) return;
            try
            {
                WriteColor("# Loading config file...", ConsoleColor.Yellow);
                //var configloaded = Config.ReadConfig(@"C:\Users\llam30\Desktop\PhongTro123.xml");
                var configloaded = Config.ReadConfig(args[0]);
                if (!configloaded)
                {
                    WriteColor("ERROR: Couldn't Found Config File!", ConsoleColor.Blue);
                    Console.ReadLine();
                    return;
                }
                List <JSON> lst = new List<JSON>();
                var mainThread = Thread.CurrentThread;
                for (int i = Config.StartPage; i <= Config.TotalPage; i++)
                {
                    WriteColor("# Start Reading Page " + i, ConsoleColor.Yellow);
                    var links = HttpService.GetDetail_URLs(Config.MainURL);
                    foreach(var link in links)
                    {
                        ThreadPool.QueueUserWorkItem((obj)=>{
                            var item = HttpService.GetDetailPage(link);
                            Console.WriteLine(link.Substring(link.LastIndexOf("/") + 1));
                            lock (lst){
                                lst.Add(item); 
                                if (lst.Count >= links.Count * i) mainThread.Resume();
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
