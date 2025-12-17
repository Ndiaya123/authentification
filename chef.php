<link rel="stylesheet" href="./dist_assets/plugins/global/plugins.bundle.css">
<link rel="stylesheet" href="https://cdn.datatables.net/1.13.6/css/jquery.dataTables.min.css">

<div class="post d-flex flex-column-fluid" id="kt_post">
    <div id="kt_content_container" class="container-xxl">
        <!-- <h2 class="text text-center">Octroyer tâche</h2> -->
        <div class="row">
            <div class="card card-xl-stretch mb-5 mb-xl-8 d-flex align-items-center justify-content-center">

            </div>
            <div id="alert"></div>
            <h2>Liste des Agents</h2>
            <!-- Button trigger modal -->
            <div class="col-sm-12">
                <div class="row">
                    <div id="kt_content_container" class="container-xxl">
                        <div class="row">
                            <div class="col-sm-12">
							  <div class=" d-flex align-items-center justify-content-end">
                                    <a href="creation-compte-personnel-admin" class="btn btn-primary"><span class="svg-icon svg-icon-primary svg-icon-2x"><!--begin::Svg Icon | path:/var/www/preview.keenthemes.com/metronic/releases/2021-05-14-112058/theme/html/demo1/dist/../src/media/svg/icons/Navigation/Plus.svg--><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
                                                <title>Stockholm-icons / Navigation / Plus</title>
                                                <desc>Ajouter un agent.</desc>
                                                <defs />
                                                <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                                    <rect fill="#000000" x="4" y="11" width="16" height="2" rx="1" />
                                                    <rect fill="#000000" opacity="0.3" transform="translate(12.000000, 12.000000) rotate(-270.000000) translate(-12.000000, -12.000000) " x="4" y="11" width="16" height="2" rx="1" />
                                                </g>
                                            </svg><!--end::Svg Icon--></span>Ajouter</a>
                                </div>
                                <div class="card card-xl-stretch mb-5 mb-xl-8">
                                    <div class="card-body py-3">
                                        <div class="py-2">
                                            
                                            <table id="kt_table_user" class="table align-middle table-row-dashed fs-6 gy-5">
                                                <thead>
                                                    <tr class="text-start text-gray-400 fw-bolder fs-7 text-uppercase gs-0">
                                                        <!-- <th>Nom</th>
                                <th>Prenom</th> -->
                                                        <th></th>
                                                        <th>Nom</th>
                                                        <!-- <th>Prenom</th> -->

                                                        <th>Email</th>
                                                        <th>Qualification</th>
                                                        <th>Grade</th>
                                                        <th>Post</th>
                                                        <th>Matricule</th>
                                                        <th>Identifiant</th>
                                                        <th>etat</th>
                                                        <!-- <th>Actions</th> -->
                                                    </tr>
                                                </thead>
                                                <tfoot></tfoot>
                                                <tbody class="text-gray-600 fw-bold" id="utilisateur"></tbody>
                                            </table>
                                        </div>
                                    </div>
                                    </body>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
</div>
<!-- DataTables JS -->
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script src="https://cdn.datatables.net/1.13.6/js/jquery.dataTables.min.js"></script>
<script src="./dist_assets/js/jquery-3.5.1.min.js"></script>

<script src="./dist_assets/plugins/custom/datatables/datatables.bundle.js"></script>
<script src="./dist_assets/plugins/custom/datatables/bootsrap4.min.js"></script>
<script src="./dist_assets/plugins/custom/datatables/modules-datatables.js"></script>
<script src="./dist_assets/plugins/custom/datatables/select.min.js"></script>