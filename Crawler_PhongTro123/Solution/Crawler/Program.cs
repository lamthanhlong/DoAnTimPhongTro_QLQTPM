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
            //args = new string[] { @"E:\Projects\TimPhongTro_QLQTPM\DoAnTimPhongTro_QLQTPM\Crawler_PhongTro123\PhongTro123.xml" };
            if (args.Length <= 0) return;
            Console.Title = $"CRAWLER [{Path.GetFileName(args[0])}]";
            WriteLog("Crawler Tool [Version 1.0]\n");
            try
            {
                List<JSON> lst = new List<JSON>();
                var mainThread = Thread.CurrentThread;
                var errorCount = 0;

                WriteColor("# Loading config file...", ConsoleColor.Yellow);
                if (!Config.ReadConfig(args[0]))
                {
                    WriteColor("ERROR: Couldn't Found Config File!", ConsoleColor.Blue);
                    Console.ReadLine();
                    return;
                }
                WriteLog("");

                for (int i = Config.StartPage; i < Config.StartPage + Config.TotalPage; i++)
                {
                    WriteColor("# Start Reading Page " + i, ConsoleColor.Yellow);
                    var links = HttpService.GetDetail_URLs(Config.MainURL + i);
                    if (links.Count == 0) continue;
                    var count = 0;
                    foreach (var link in links)
                    {
                        ThreadPool.QueueUserWorkItem((obj) =>
                        {
                            var item = HttpService.GetDetailPage(link);
                            WriteLog(link.Substring(link.LastIndexOf("/") + 1));
                            lock (lst)
                            {
                                lst.Add(item);
                                count++;
                                if (count == links.Count) mainThread.Resume();
                            }
                        });
                    }
                    mainThread.Suspend();
                    if (lst.Count >= Config.RecordPerFile || i == Config.StartPage + Config.TotalPage - 1)
                    {
                        WriteColor($"\n# Writing JSON file [{Config.TotalFile}]...", ConsoleColor.Yellow);
                        JSON.WriteFile(lst);
                        CrawlerError.LogError(Config.lstError);
                        Config.TotalFile++;
                        errorCount += Config.lstError.Count;
                        lst.Clear();
                        Config.lstError.Clear();
                    }
                    WriteLog("");
                }
                WriteColor($"=============================\n# Completed!, {Config.TotalFile - 1} FILE, {errorCount} ERROR", ConsoleColor.Green, false);
            }
            catch (Exception ex)
            {
                WriteColor("================== ERROR ==================", ConsoleColor.Blue);
                WriteLog(ex.ToString(), false);
            }
            File.WriteAllText($"{Config.ResultDirectory}/Process.log", Config.Logging);
            Console.ReadLine();
        }

        static void WriteLog(string text, bool isNewLine = true)
        {
            if (isNewLine)
            {
                Config.Logging += text + "\n";
                Console.WriteLine(text);
            }
            else
            {
                Config.Logging += text;
                Console.Write(text);
            }
        }

        static void WriteColor(string text, ConsoleColor color, bool isNewLine = true)
        {
            Console.ForegroundColor = color;
            if (isNewLine)
            {
                Config.Logging += text + "\n";
                Console.WriteLine(text);
            }
            else
            {
                Config.Logging += text;
                Console.Write(text);
            }
            Console.ResetColor();
        }
    }
}
