<?php
// Öppnar SQL anslutningen
	// Skapar namn och lösen baseras på dabasens uppgifter
    $servername = "localhost";
    $username = "root";
    $password = 'wqd#"few4fewf#¤rer';
    $dbname = "scheduleapp";
                        
    // Skapa SQL anslutning och Konntrollera den
        /* Koden gäller enligt:
            * 1 - Anslutning görs med SQL PDO och idenifierar sig med angivna värden; Anslutningen sparas i veriabeln $hbgWorksqlconn
            * 2 - $hbgWorksqlconn sätts till error mode "exception"
            * 	   Om anslutningen misslyckas får användaren upp ett felmeddelande (catch) enligt dess kod
            
        */
                    
        try
            {
                $hbgWorksqlconn = new PDO("mysql:host=$servername;dbname=$dbname;charset=utf8", $username, $password);
                
                // set the PDO error mode to exception
                    $hbgWorksqlconn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            }
            
                catch(PDOException $error)
                    {
                        echo "Anslutning misslyckades, kalla på Fredrik!" . $error->getMessage();
                    }
                    

        try
            {
                /*1*/ $selectsTest = 'SELECT * FROM data';
                /*2*/ $selectsTest2 = $hbgWorksqlconn->query($selectsTest);
                /*3*/ $selectsTest2 ->setFetchMode(PDO::FETCH_ASSOC);
            }
                catch (PDOException $perrorSelectsTest)
                    {
                        die("Kunde inte upprätta en anslutning till $dbname" . $perrorSelectsTest>getMessage());
                    }
            
    //Plockar ut antalet rader från db enligt samma krav som ovan
        try
            {
                // Visar antalet rader för den uttagna SQL datan
                /*4*/ $getRowsSelectsTest = $selectsTest;
            }
                catch (PDOException $perrorSelectsTest)
                    {
                        die("Kunde inte upprätta en anslutning till $dbname" .$ettings_link_text_sqldata_end. $perrorsortering2>getMessage());
                    }							
							
                    if($row_null = $hbgWorksqlconn->query($getRowsSelectsTest))
                    {
                    if($row_null->fetchColumn() >0)
                        {
                        // Presenterar datan enligt en loop
                           while ($selectData = $selectsTest2->fetch()):
                          
                            echo htmlspecialchars($selectData['id']);
                                                                            
                            // Slut på loop
                                endwhile;
                        }					
                        else
                            {
                                echo $no_result;
                            }
                    }
?>