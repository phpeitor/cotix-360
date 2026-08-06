<?php

function textoOfertaExcel($value): string
{
    return trim(preg_replace('/\s+/', ' ', html_entity_decode(strip_tags((string)($value ?? '')), ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8')));
}

function fechaOfertaExcel($fecha): string
{
    try {
        return (new DateTime((string)$fecha))->format('j/n/Y');
    } catch (Throwable $e) {
        return (new DateTime('now', new DateTimeZone('America/Lima')))->format('j/n/Y');
    }
}

function numeroOfertaExcel(array $receta): string
{
    $year = date('Y');
    if (!empty($receta['created_at'])) {
        try {
            $year = (new DateTime((string)$receta['created_at']))->format('Y');
        } catch (Throwable $e) {
            $year = date('Y');
        }
    }

    return sprintf('%05d-%s', (int)($receta['id'] ?? 0), $year);
}

function agruparOfertaExcel(array $detalle): array
{
    $grupos = [];
    foreach ($detalle as $item) {
        $subcat = textoOfertaExcel($item['sub_cat_1'] ?? '');
        if ($subcat === '') {
            $subcat = 'SIN CATEGORÍA';
        }

        if (!isset($grupos[$subcat])) {
            $grupos[$subcat] = [];
        }
        $grupos[$subcat][] = $item;
    }

    return $grupos;
}

function totalOfertaConMargenExcel(array $categorias): float
{
    $total = 0.0;

    foreach ($categorias as $categoria) {
        $subtotal = (float)($categoria['subtotal'] ?? 0);
        $margen = max(0, min(100, (float)($categoria['margen'] ?? 0)));
        $margenDecimal = $margen / 100;

        if ($subtotal <= 0 || $margenDecimal >= 1) {
            continue;
        }

        $total += $subtotal / (1 - $margenDecimal);
    }

    return $total;
}

function totalesOfertaExcel(array $categorias): array
{
    $subtotal = round(totalOfertaConMargenExcel($categorias), 2, PHP_ROUND_HALF_UP);
    $igv = round($subtotal * 0.18, 2, PHP_ROUND_HALF_UP);
    $total = round($subtotal + $igv, 2, PHP_ROUND_HALF_UP);

    return [
        'subtotal' => $subtotal,
        'igv' => $igv,
        'total' => $total,
    ];
}

function normalizarSubcatOfertaExcel($value): string
{
    $text = mb_strtoupper(textoOfertaExcel($value), 'UTF-8');
    return strtr($text, [
        'Á' => 'A',
        'É' => 'E',
        'Í' => 'I',
        'Ó' => 'O',
        'Ú' => 'U',
        'Ü' => 'U',
        'Ñ' => 'N',
    ]);
}

function detalleTieneSubcatOfertaExcel(array $subcatsPresentes, array $subcatsBuscadas): bool
{
    foreach ($subcatsBuscadas as $subcat) {
        if (isset($subcatsPresentes[normalizarSubcatOfertaExcel($subcat)])) {
            return true;
        }
    }

    return false;
}

function subcatsPresentesOfertaExcel(array $detalle): array
{
    $subcatsPresentes = [];

    foreach ($detalle as $item) {
        $subcatNormalizada = normalizarSubcatOfertaExcel($item['sub_cat_1'] ?? '');
        if ($subcatNormalizada !== '') {
            $subcatsPresentes[$subcatNormalizada] = true;
        }
    }

    return $subcatsPresentes;
}

function seccionesCondicionalesOfertaExcel(array $detalle): array
{
    $subcatsPresentes = subcatsPresentesOfertaExcel($detalle);
    $secciones = [];

    if (detalleTieneSubcatOfertaExcel($subcatsPresentes, ['PERNERIA', 'CONSUMIBLE', 'EMBALAJE'])) {
        $secciones[] = [
            'titulo' => 'PERNERIA, SOPORTES, ACCESORIOS Y EMBALAJE',
            'contenido' => "* Conjunto de pernería y soporteria estructural, compuesto por pernos, tuercas, arandelas planas y de presión, espárragos, rieles y soportes metálicos, fabricados en acero galvanizado para garantizar resistencia mecánica y protección contra la corrosión.\n\n" .
                "* Consumibles para ensamblaje, comprendiendo todos los materiales menores necesarios para la correcta instalación y conexionado de los componentes internos. Esto incluye terminales de compresión, punteras, tubos termoencogibles, cintas, bridas plásticas, marcadores, asegurando una conexión segura, duradera y correctamente identificada de los conductores y equipos del tablero.\n\n" .
                "* Embalaje estándar para tablero. incluye film plástico, esquineros de cartón y base de madera, garantizando protección contra polvo, humedad y golpes durante transporte y manejo.",
            'altura_excel' => 180,
        ];
    }

    if (detalleTieneSubcatOfertaExcel($subcatsPresentes, ['TRABAJADOR'])) {
        $secciones[] = [
            'titulo' => 'SERVICIOS DE INGENIERÍA Y PRUEBAS',
            'contenido' => "El alcance de los servicios comprende la ejecución de trabajos de ingeniería de detalle, configuración y/o programación FAT, pruebas de aceptación en fábrica FAT, como se detalla a continuación\n\n" .
                "Pruebas FAT-Factory Acceptance Test Comprenden las siguientes actividades según apliquen para cada producto:-Timbrado de las tablas de conexión.-Amarillado sobre los planos esquemáticos.-Energización de todos los equipos de control, protección y medida.-Prueba de medición de continuidad y Megado-Pruebas de mandos de equipos de maniobra.-Parametrización básica de los equipos-Pruebas de verificación de lecturas en equipos-Elaboración de protocolos de prueba",
            'altura_excel' => 132,
        ];
    }

    if (detalleTieneSubcatOfertaExcel($subcatsPresentes, ['INGENIERIA AL DETALLE'])) {
        $secciones[] = [
            'titulo' => 'INGENIERÍA DE DETALLE',
            'contenido' => "Planos mecánicos de distribución de equipos.\n" .
                "Fichas de conexionado interno.\n" .
                "Planos / Esquemas eléctrico del Tablero\n" .
                "Planos unifilares\n" .
                "Planos mecánicos de distribución de equipos\n" .
                "Hojas técnicas del tablero.\n" .
                "Lista de señales de entrada y salida (de ser el caso)\n" .
                "Plano de integración entre tablero, grupos y celdas del cliente. Indicando lista de cables a utilizar para el cableado externo.\n" .
                "Protocolos de pruebas\n" .
                "Filosofía de control\n" .
                "Plano de arquitectura de tablero",
            'altura_excel' => 132,
        ];
    }

    if (detalleTieneSubcatOfertaExcel($subcatsPresentes, ['DOCUMENTACION DE CALIDAD'])) {
        $secciones[] = [
            'titulo' => 'CALIDAD',
            'contenido' => "Procedimiento de fabricación.\n" .
                "Hojas técnicas del tablero.\n" .
                "Plan de Puntos de Inspección (PPI)\n" .
                "Plan y formatos de control de calidad\n" .
                "Certificados de control de calidad\n" .
                "Fichas técnicas\n" .
                "Demás documentos a requerir según la lista de entregables.\n" .
                "Dossier de Calidad",
            'altura_excel' => 112,
        ];
    }

    return $secciones;
}

function enteroEnLetrasOfertaExcel(int $numero): string
{
    $unidades = ['', 'UNO', 'DOS', 'TRES', 'CUATRO', 'CINCO', 'SEIS', 'SIETE', 'OCHO', 'NUEVE'];
    $especiales = [10 => 'DIEZ', 11 => 'ONCE', 12 => 'DOCE', 13 => 'TRECE', 14 => 'CATORCE', 15 => 'QUINCE', 20 => 'VEINTE'];
    $decenas = [2 => 'VEINTI', 3 => 'TREINTA', 4 => 'CUARENTA', 5 => 'CINCUENTA', 6 => 'SESENTA', 7 => 'SETENTA', 8 => 'OCHENTA', 9 => 'NOVENTA'];
    $centenas = [1 => 'CIENTO', 2 => 'DOSCIENTOS', 3 => 'TRESCIENTOS', 4 => 'CUATROCIENTOS', 5 => 'QUINIENTOS', 6 => 'SEISCIENTOS', 7 => 'SETECIENTOS', 8 => 'OCHOCIENTOS', 9 => 'NOVECIENTOS'];

    if ($numero === 0) return 'CERO';
    if ($numero === 100) return 'CIEN';
    if ($numero < 10) return $unidades[$numero];
    if (isset($especiales[$numero])) return $especiales[$numero];
    if ($numero < 20) return 'DIECI' . strtolower($unidades[$numero - 10]);
    if ($numero < 30) return $numero === 20 ? 'VEINTE' : 'VEINTI' . strtolower($unidades[$numero - 20]);
    if ($numero < 100) {
        $decena = intdiv($numero, 10);
        $unidad = $numero % 10;
        return $decenas[$decena] . ($unidad > 0 ? ' Y ' . $unidades[$unidad] : '');
    }
    if ($numero < 1000) {
        $centena = intdiv($numero, 100);
        $resto = $numero % 100;
        return $centenas[$centena] . ($resto > 0 ? ' ' . enteroEnLetrasOfertaExcel($resto) : '');
    }
    if ($numero < 1000000) {
        $miles = intdiv($numero, 1000);
        $resto = $numero % 1000;
        $textoMiles = $miles === 1 ? 'MIL' : enteroEnLetrasOfertaExcel($miles) . ' MIL';
        return $textoMiles . ($resto > 0 ? ' ' . enteroEnLetrasOfertaExcel($resto) : '');
    }

    $millones = intdiv($numero, 1000000);
    $resto = $numero % 1000000;
    $textoMillones = $millones === 1 ? 'UN MILLON' : enteroEnLetrasOfertaExcel($millones) . ' MILLONES';
    return $textoMillones . ($resto > 0 ? ' ' . enteroEnLetrasOfertaExcel($resto) : '');
}

function totalEnLetrasOfertaExcel(float $monto): string
{
    $monto = round($monto, 2);
    $entero = (int)floor($monto);
    $centimos = (int)round(($monto - $entero) * 100);

    if ($centimos === 100) {
        $entero++;
        $centimos = 0;
    }

    return mb_strtoupper(enteroEnLetrasOfertaExcel($entero), 'UTF-8') . ' Y ' . str_pad((string)$centimos, 2, '0', STR_PAD_LEFT) . '/100 DOLARES AMERICANOS';
}

function terminosCondicionesVentaOferta(int $condicionesEconomicasDias = 0, bool $mostrarCondicionesEconomicas = false): array
{
    $terminos = [
        '1. Sobre la forma de entrega:',
        '1.1. La entrega de la mercancía se efectuará en los almacenes del cliente en Lima adjuntándose los manuales y hojas técnicas que correspondan a ésta cuando estos hayan sido solicitados por el cliente previamente. Puede convenirse con el cliente hacer entrega de la mercadería en las instalaciones de MG INDUSOL S.A.C.',
        '1.2. El transporte y seguro de la mercadería que será entregada al cliente, quedan a solicitud, cuenta, costo y riesgo del mismo (emitente de la orden de compra). En tal sentido, el cliente asume todos los riesgos; incluso, aquellos relacionados con circunstancias de fuerza mayor y/o casos fortuitos y/o hechos de responsabilidad del transportista y, además, asume los riesgos (incluidos daños y perjuicios) que pudiesen sufrir las mercaderías durante el transporte.',
        '1.3. Cualquier instrucción especial para el envío o embarque de la mercadería a lugares fuera de Lima, deberá coordinarse y especificarse de manera explícita y anticipada al momento de la emisión de la orden de compra de la mercadería efectuándose los arreglos pertinentes con la agencia de transportes contratada por el cliente.',
        '1.4. Se puede convenir la entrega de la mercadería al cliente por cuenta, costo y riesgo de MG INDUSOL S.A.C, dentro de la ciudad de Lima y Callao. Cuando el monto de venta sea igual o mayor a los USD 1.500,00 (Un mil quinientos y 00/100 dólares americanos).',
        '1.5. Todo reclamo por faltantes y daños físicos en la mercadería recibida por el cliente, deberá ser comunicada por el transportista a éste de manera inmediata. MG INDUSOL S.A.C. no asume responsabilidad una vez que los bienes salen de su local.',
        '1.6. Cualquier instrucción especial para el envío, embarque y/o embalaje de la mercadería deberá coordinarse y especificarse de manera explícita y anticipada al momento de la emisión de la orden de compra de la mercadería. Siendo estas instrucciones previamente aceptadas en la oferta o medio escrito por MG INDUSOL S.A.C.',
        '1.7. No se aceptará anulación total o parcial de órdenes de compra, salvo casos fortuitos o de fuerza mayor debidamente sustentados. En caso MG INDUSOL S.A.C. tenga a bien aceptar la anulación total o parcial; este hecho devengará la obligación del cliente de pagar a MG INDUSOL S.A.C. el 6% del valor de la orden de compra por concepto de gastos administrativos, y de ser el caso, se trasladará al cliente las penalidades y cargos endosados por el proveedor con el que trabaja. Estas penalidades y demás cargos dependerán de la afectación ocasionada al proveedor al momento de la anulación de la orden de compra, pudiendo llegar hasta el 100% del valor de la mercadería.',
        '1.8. El cliente tiene que haber dado conformidad a las especificaciones técnicas de la mercadería a recibir, según informaciones y datos recibidos de la misma. No habrá lugar a reclamo respecto a aditamentos no contemplados en la oferta y/o información técnica recibida por el cliente.',
        '2. Sobre los tiempos de entrega:',
        '2.1. El plazo de entrega se contará desde el momento en que el cliente haya aceptado las condiciones comerciales pactadas con MG INDUSOL S.A.C. mediante la emisión de su orden de compra y confirmada por escrito por MG INDUSOL S.A.C.',
        '2.2. La demora por parte del cliente en el cumplimiento de las condiciones comerciales establecidas acarreará que de forma automática pueda modificarse el plazo de entrega de la mercadería, pudiendo el nuevo plazo depender de circunstancias ajenas a MG INDUSOL S.A.C., relacionadas éstas a las posibilidades de trabajo, disponibilidad y/o desarrollo de la producción por parte de los proveedores/fabricantes. Por ningún motivo la extensión del plazo de entrega por el motivo expuesto anteriormente será causal de rescisión del contrato o cancelación de una orden de compra emitida por el cliente.',
        '2.3. El plazo de entrega podrá ser extendido debido a causas de fuerza mayor o casos fortuitos, fallas en la fabricación, accidentes, huelgas, falta de suministro de nuestros proveedores y otras causas que escapan del control de MG INDUSOL S.A.C.',
        '2.4. Por ningún motivo, MG INDUSOL S.A.C. pagará multas u otras penalidades por demoras.',
        '3. Sobre los precios:',
        '3.1. Nuestros precios están fijados en la unidad monetaria que se especifique en la propuesta económica cotizada al comprador.',
        '3.2. MG INDUSOL S.A.C. respetará los precios durante el plazo de validez de la oferta que se indique por escrito al cliente. Cualquier cambio que se considere en los precios inicialmente pactados, será acordado con antelación con el cliente dándose mutua aceptación de manera escrita a las nuevas condiciones establecidas.',
        '3.3. En caso se haya cotizado precio CIF puerto peruano, éstos se ajustarán conforme a las variaciones en las tarifas de fletes, tributos, impuestos Ad Valorem, I.G.V., y otros conceptos que puedan afectar el precio originalmente cotizado. Sin perjuicio de lo señalado y con la excepción indicada anteriormente, MG INDUSOL S.A.C. respetará los precios durante el plazo de validez de la oferta que hubiere sido indicado por escrito.',
        '3.4. Los precios cotizados por MG INDUSOL S.A.C. no incluyen embalajes, flete, seguros, manipuleo en el almacén de cliente, por lo cual, se le cobrará un monto adicional por esto conceptos según se convenga con el cliente en caso se le tenga que prestar los servicios anteriormente indicados bajo condiciones especiales que la situación lo amerite.',
        '4. Sobre las formas de pago:',
        '4.1. Los pagos se efectuarán en la moneda cotizada.',
        '4.2. Cuando la importación de la mercadería queda a cargo del cliente, este deberá realizar con diligente prontitud las gestiones que corresponden ante aduanas y bancos, para obtener sin demora los documentos que permitan el pago y/o la liquidación de la operación bancaria de crédito en el exterior.',
        '4.3. Las entregas parciales establecidas con los términos de pago adscritos convenidos con MG INDUSOL S.A.C. serán facturadas.',
        '4.4. En caso de mora en el pago por parte de cliente, se le devengarán intereses compensatorios y moratorios con la tasa máxima permitida por ley. Además, en caso de mora se aplicará una penalidad a favor de MG INDUSOL S.A.C. del 3% del monto impago por cada mes hasta que se cumpla con la cancelación de lo adeudado.',
        '5. Sobre las garantías:',
        '5.1. MG INDUSOL S.A.C. traslada al cliente la garantía que otorga cada fabricante de los productos que distribuye y/o comercializa. En consecuencia, MG INDUSOL S.A.C. no otorga garantías complementarias y/o extendidas que las que otorgan las empresas a las cuales representa.',
        '5.2. Todo reclamo en garantía será tramitado a través de MG INDUSOL S.A.C., para lo cual, el cliente deberá por su cuenta y costo entregar y luego recoger el equipo, pieza, producto etc. en Calle Brea y Pariñas N°102, Oficina 704, piso 7, Santiago de Surco, Lima-Perú con la presentación del código de devolución que MG INDUSOL S.A.C. le facilitará (RMA) y la factura correspondiente al equipo, pieza o producto que es motivo de reclamo. Téngase en cuenta que los reclamos serán atendidos para clientes que adquieran directamente la mercadería a MG INDUSOL S.A.C.',
        '5.3. Los reclamos deben ser presentados por escrito indicando el motivo del reclamo y, de ser el caso, describiendo la falla. Los productos objeto de reclamo deberán estar debidamente embalados y con el número RMA debidamente rotulado en el exterior del embalaje. No se recibirá ningún equipo sin número de RMA.',
        '5.4. Se perderá la garantía que el fabricante otorga al cliente si los equipos han sido sometidos a:',
        '5.4.1. Mantenimiento, reparación, instalación, manipulación, embalaje, transporte, almacenamiento, operación o uso diferente para el que fue cotizado, o que no esté en conformidad con las instrucciones dadas por MG INDUSOL S.A.C. y/o no se encuentren en los manuales de instalación, operación y mantenimiento de los equipos.',
        '5.4.2. Alteración, modificación o reparación por alguien distinto a aquellos específicamente autorizados por MG INDUSOL S.A.C.',
        '5.4.3. Accidente, contaminación, daño por materiales extraños, daño, abuso, descuido o negligencia.',
        '5.4.4. Uso de piezas o recambios que no sean suministrados o aprobados previamente por MG INDUSOL S.A.C. y que hayan sido solicitados por escrito por el cliente.',
        '5.5. Los gastos de desmontaje y montaje, así como los de transporte, serán por cuenta del cliente.',
        '5.6. El plazo de garantía es fijo y no se prorrogará y consta expresamente en el Certificado De Garantía del Fabricante que MG INDUSOL S.A.C. entregará al cliente.',
        '5.7. La garantía otorgada por el fabricante se perderá si el cliente desarma o modifica cualquier mercadería o equipo sujeto a garantía o procede al montaje o instalación del equipo sin seguir las instrucciones de los manuales de instalación que son entregados con los equipos o que el cliente puede descargar de las páginas web de los fabricantes solicitándolos por escrito.',
    ];

    if ($mostrarCondicionesEconomicas && $condicionesEconomicasDias > 0) {
        $terminos[] = '6. Condiciones Económicas por Suspensión de Servicio:';
        $terminos[] = '6.1. En caso de que el servicio sea pausado o suspendido por un periodo superior a ' . $condicionesEconomicasDias . ' días, debido a causas no imputables a nuestra empresa, y en concordancia con los principios generales establecidos, la propuesta inicial comercial perderá su vigencia. La reanudación del servicio estará sujeta a una reformulación de la oferta comercial que reconozca los costos directos e indirectos derivados de la postergación, tales como la reposición, adquisición o sustitución de materiales y componentes afectados por deterioro o caducidad, así como los costos de renovación de acreditaciones, homologaciones e inducciones del personal y demás requisitos técnicos o administrativos exigidos para la operatividad del proyecto.';
    }

    return $terminos;
}
